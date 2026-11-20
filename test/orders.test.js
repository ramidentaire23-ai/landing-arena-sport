'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,input,context,references}=require('./helpers');
const {createCarrier}=require('../server/carrier');
const {publicReferences,priceOrder,normalizePhone,metaEvent}=require('../server/domain');
test('canonical prices, phones, zero fees, active communes and exact station wilayas',()=>{
 assert.equal(normalizePhone('00213 660 000 001'),'0660000001');
 assert.equal(normalizePhone('+213 660 000 001'),'0660000001');
 assert.equal(normalizePhone('not a phone'),null);
 const ref=publicReferences(references);
 assert.deepEqual(ref.wilayas.find(w=>w.id===1).desks.map(d=>d.code),['1A']);
 assert.deepEqual(ref.wilayas.find(w=>w.id===10).desks.map(d=>d.code),['10A']);
 assert.throws(()=>priceOrder(input({stationCode:'10A'}),ref),/INVALID_ORDER/);
 assert.throws(()=>priceOrder(input({deliveryType:'home',communeZip:'16002',address:'Test Address'}),ref),/INVALID_ORDER/);
 const order=priceOrder(input({wilayaId:49,stationCode:'49A',unitPrice:1,total:1}),ref);
 assert.equal(order.total,2900);assert.equal(order.shipping,0);
 const event=metaEvent({...order,id:'test-id'},context,'Purchase',new Date());
 assert.equal(event.custom_data.value,2900);assert.equal(event.custom_data.content_ids[0],'ar1x5xmsm1');
});
test('NOEST HTTP 200 business failures and missing tracking never become accepted',async()=>{
 for(const [body,uncertain]of [[{success:false,error:'station_code'},false],[{success:false,error:'duplicate_order'},true],[{success:true},true],[{},true]]){
  const carrier=createCarrier({NOEST_API_TOKEN:'test-only',NOEST_USER_GUID:'test-only'},async()=>new Response(JSON.stringify(body),{status:200}));
  await assert.rejects(carrier.create({...priceOrder(input(),publicReferences(references)),reference:'TEST12345'}),e=>e.uncertain===uncertain);
 }
});
test('accepted retry creates one parcel and one durable Purchase, token guards receipt',async t=>{
 const f=await fixture();t.after(f.close);const body=input();
 const [a,b]=await Promise.all([f.service.create(body,context),f.service.create(body,context)]);
 assert.equal(f.calls.length,1);assert.ok([a,b].some(r=>r.status==='accepted'));
 assert.equal((await f.db.query('SELECT * FROM meta_event_outbox')).length,1);
 const receipt=await f.service.receipt(body.idempotencyKey,body.receiptToken);
 assert.equal(receipt.eventId,'purchase:'+body.idempotencyKey);
 assert.notEqual(receipt.eventId,receipt.tracking);assert.equal(receipt.purchase.value,2900);
 assert.equal(await f.service.receipt(body.idempotencyKey,'wrong'),null);
 await assert.rejects(f.service.create({...body,variantId:'transparent'},context),/IDEMPOTENCY_CONFLICT/);
});
test('NOEST rejection is recorded with zero Purchase events',async t=>{
 const f=await fixture();t.after(f.close);
 const result=await f.service.create(input({clientName:'Reject Test'}),context);
 assert.equal(result.status,'rejected');assert.equal((await f.db.query('SELECT * FROM meta_event_outbox')).length,0);
});
test('uncertain create is pending and a retry does not create a second parcel',async t=>{
 const f=await fixture();t.after(f.close);const body=input({clientName:'Pending Test'});
 assert.equal((await f.service.create(body,context)).status,'pending');
 assert.equal((await f.service.create(body,context)).status,'pending');
 assert.equal(f.calls.length,1);assert.equal((await f.db.query('SELECT * FROM meta_event_outbox')).length,0);
 await assert.rejects(f.service.reconcilePending(body.idempotencyKey,'unknown'),/TRACKING_DOES_NOT_MATCH/);
});
test('pending reconciliation verifies reference and amount before recording Purchase',async t=>{
 const f=await fixture();t.after(f.close);const body=input({clientName:'Pending Test'});
 const result=await f.service.create(body,context);
 f.infos.RECOVERED={OrderInfo:{reference:result.reference,montant:3350},activity:[]};
 assert.equal((await f.service.reconcilePending(body.idempotencyKey,'RECOVERED')).status,'accepted');
 assert.equal((await f.db.query('SELECT * FROM meta_event_outbox')).length,1);
});
test('outbox retries the same event ID after a Meta failure',async t=>{
 let ok=false;const requests=[];
 const f=await fixture({env:{META_CAPI_ACCESS_TOKEN:'test-only'},fetcher:async(url,options)=>{
  requests.push(JSON.parse(options.body));return new Response(JSON.stringify(ok?{events_received:1}:{error:'fixture'}),{status:ok?200:503});
 }});t.after(f.close);
 await f.service.create(input(),context);
 assert.equal((await f.service.flushEvents()).sent,0);
 await f.db.query("UPDATE meta_event_outbox SET next_attempt_at=now()-interval '1 minute'");
 ok=true;assert.equal((await f.service.flushEvents()).sent,1);
 assert.equal((await f.service.flushEvents()).sent,0);
 assert.equal(requests[0].data[0].event_id,requests[1].data[0].event_id);
 assert.equal(requests[0].data[0].user_data.fbc,context.fbc);
});
test('delivery aliases, cash receipt and repeat polling produce one delivery event',async t=>{
 const f=await fixture({env:{DELIVERY_EVENTS_ENABLED:'true'}});t.after(f.close);
 const a=await f.service.create(input(),context);
 f.infos[a.tracking].activity=[
  {event_key:'livred',event:'Delivered',date:'2026-11-20 10:00:00'},
  {event_key:'validation_reception_cash_by_partener',date:'2026-11-20 11:00:00'},
  {event_key:'unknown_new_event',date:'2026-11-20 12:00:00'}];
 await f.service.syncOrders();await f.service.syncOrders();
 const events=await f.db.query('SELECT * FROM meta_event_outbox');
 assert.equal(events.filter(e=>e.event_name==='Purchase').length,1);
 assert.equal(events.filter(e=>e.event_name==='OrderDelivered').length,1);
 const [order]=await f.db.query('SELECT * FROM orders');
 assert.equal(order.carrier_state,'delivered');assert.ok(order.paid_at);
 assert.equal((await f.db.query('SELECT * FROM noest_history')).length,3);
});
test('delivery is stored without emitting a custom event until its live timestamp gate is enabled',async t=>{
 const f=await fixture();t.after(f.close);const a=await f.service.create(input(),context);
 f.infos[a.tracking].activity=[{event_key:'livre',date:'2026-11-20 10:00:00'}];await f.service.syncOrders();
 assert.equal((await f.db.query('SELECT * FROM meta_event_outbox')).length,1);
 assert.ok((await f.db.query('SELECT delivered_at FROM orders'))[0].delivered_at);
});
test('public server denies source files, unauthorized jobs and cross-origin orders',async t=>{
 const {createApp}=require('../server');
 const f=await fixture();t.after(f.close);
 const server=createApp({service:f.service,env:{CRON_SECRET:'test-secret'},background:()=>{}}).listen(0);
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base='http://localhost:'+server.address().port;
 for(const url of ['/server/index.js','/.env','/data/noest_fees.json','/package.json'])assert.equal((await fetch(base+url)).status,404);
 assert.equal((await fetch(base+'/api/internal/reconcile')).status,401);
 assert.equal((await fetch(base+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://other.example'},body:JSON.stringify(input())})).status,403);
 assert.equal((await fetch(base+'/api/orders/receipt',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,404);
});

test('NOEST sparse numeric-object commune lists normalize to active reference records',async()=>{
 const bodies=[references.wilayas,Object.fromEntries(references.communes.map((c,i)=>[i*2,c])),references.desks,{tarifs:{delivery:references.fees}}];let i=0;
 const c=createCarrier({NOEST_API_TOKEN:'fixture',NOEST_USER_GUID:'fixture'},async()=>new Response(JSON.stringify(bodies[i++]),{status:200}));
 const ref=publicReferences(await c.references());assert.equal(ref.wilayas.find(w=>w.id===16).communes.length,1);assert.equal(ref.wilayas.find(w=>w.id===49).deskFee,0);
});

test('a return request alone does not count as a dispatched parcel',async t=>{
 const f=await fixture();t.after(f.close);const a=await f.service.create(input(),context);
 f.infos[a.tracking].activity=[{event_key:'return_asked_by_customer',date:'2026-11-20 10:00:00'}];await f.service.syncOrders();
 assert.equal(Number((await f.service.metrics()).orders.dispatched),0);
 f.infos[a.tracking].activity=[{event_key:'validation_collect_colis',date:'2026-11-20 09:00:00'},{event_key:'return_asked_by_customer',date:'2026-11-20 10:00:00'}];await f.service.syncOrders();
 assert.equal(Number((await f.service.metrics()).orders.dispatched),1);
});
