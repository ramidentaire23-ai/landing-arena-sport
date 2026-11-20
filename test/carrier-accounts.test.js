'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fixture,input,context,references}=require('./helpers');
const {createOrderService}=require('../server/orders');
const {createCarrier}=require('../server/carrier');
const forbidden=async()=>{throw new Error('EXTERNAL_REQUEST_FORBIDDEN_IN_FIXTURE');};
function service(f,carrier,legacyCarrier=null){return createOrderService({db:f.db,carrier,legacyCarrier,env:{},fetcher:forbidden});}

test('account identity survives token rotation and changes with the NOEST account',()=>{
 const a=createCarrier({NOEST_USER_GUID:'account-a',NOEST_API_TOKEN:'token-a'});
 const rotated=createCarrier({NOEST_USER_GUID:'account-a',NOEST_API_TOKEN:'token-b'});
 const b=createCarrier({NOEST_USER_GUID:'account-b',NOEST_API_TOKEN:'token-a'});
 assert.equal(a.accountKey(),rotated.accountKey());assert.notEqual(a.accountKey(),b.accountKey());
 assert.match(a.accountKey(),/^[a-f0-9]{64}$/);assert.ok(!a.accountKey().includes('account-a'));
});

test('switching accounts isolates fees and routes old tracking without recreating its order',async t=>{
 const f=await fixture();t.after(f.close);
 const oldReads=[],newReads=[];let oldCreates=0,newCreates=0;
 const old={...f.carrier,accountKey:()=> 'brother',create:async o=>{oldCreates++;return f.carrier.create(o);},info:async ts=>{oldReads.push(ts);return f.carrier.info(ts);}};
 const oldService=service(f,old),oldInput=input();
 const accepted=await oldService.create(oldInput,context);
 const ownRefs=structuredClone(references);ownRefs.fees[16].tarif_stopdesk='600';
 const own={...f.carrier,accountKey:()=> 'personal',references:async()=>ownRefs,create:async o=>{newCreates++;return f.carrier.create(o);},info:async ts=>{newReads.push(ts);return f.carrier.info(ts);}};
 const after=service(f,own,old);
 assert.equal((await after.getReferences()).wilayas.find(w=>w.id===16).deskFee,600);
 assert.equal((await after.create(oldInput,context)).tracking,accepted.tracking);
 assert.equal(oldCreates,1);assert.equal(newCreates,0);
 const newInput=input();const ownOrder=await after.create(newInput,context);assert.equal(oldCreates,1);assert.equal(newCreates,1);
 const oldReceipt=await after.receipt(oldInput.idempotencyKey,oldInput.receiptToken),newReceipt=await after.receipt(newInput.idempotencyKey,newInput.receiptToken);
 assert.equal(oldReceipt.order.carrierAccountKey,'brother');assert.equal(newReceipt.order.carrierAccountKey,'personal');
 assert.equal(oldReceipt.order.total,3350);assert.equal(newReceipt.order.total,3500);
 assert.equal((await f.db.query('SELECT * FROM noest_reference_cache')).length,2);
 await after.syncOrders();assert.deepEqual(oldReads,[[accepted.tracking]]);assert.deepEqual(newReads,[[ownOrder.tracking]]);
 assert.equal((await f.db.query("SELECT * FROM meta_event_outbox WHERE event_name='Purchase'")).length,2);
});

test('untagged accepted and pending orders continue using the retained previous account',async t=>{
 const f=await fixture();t.after(f.close);
 const accepted=await f.service.create(input(),context),pendingInput=input({clientName:'Pending Test'});
 const pending=await f.service.create(pendingInput,context);
 await f.db.query("UPDATE orders SET order_data=order_data-'carrierAccountKey'");
 let legacyReads=0;
 const old={...f.carrier,accountKey:()=> 'old',create:async()=>{throw new Error('LEGACY_CREATION_FORBIDDEN');},info:async ts=>{legacyReads++;return f.carrier.info(ts);}};
 const own={...f.carrier,accountKey:()=> 'new',info:async()=>{throw new Error('OLD_TRACKING_SENT_TO_NEW_ACCOUNT');}};
 const after=service(f,own,old);
 assert.equal((await after.syncOrders()).updated,1);
 f.infos.RECOVERED={OrderInfo:{reference:pending.reference,montant:3350},activity:[]};
 const recovered=await after.reconcilePending(pendingInput.idempotencyKey,'RECOVERED');
 assert.equal(recovered.status,'accepted');assert.equal(legacyReads,2);
 assert.equal((await f.db.query("SELECT * FROM meta_event_outbox WHERE event_name='Purchase'")).length,2);
 assert.equal(accepted.status,'accepted');
});

test('an order with an unavailable owner is never sent to another NOEST account',async t=>{
 const f=await fixture();t.after(f.close);const order=await f.service.create(input(),context);
 await f.db.query("UPDATE orders SET order_data=jsonb_set(order_data,'{carrierAccountKey}',$2::jsonb) WHERE id=$1",[order.orderId,JSON.stringify('unavailable-account')]);
 let infoCalls=0;
 const own={...f.carrier,accountKey:()=> 'new',info:async()=>{infoCalls++;return {};}};
 await assert.rejects(service(f,own).syncOrders(),/ORDER_CARRIER_ACCOUNT_UNAVAILABLE/);assert.equal(infoCalls,0);
});

test('a missing carrier tracking remains accepted for review without creating another Purchase',async t=>{
 const c=createCarrier({NOEST_USER_GUID:'fixture',NOEST_API_TOKEN:'fixture'},async()=>new Response(JSON.stringify({message:'Trackings non trouvés'}),{status:404}));
 assert.deepEqual(await c.info(['missing']),{});
 await assert.rejects(c.create({variant:{name_fr:'fixture'},quantity:1}),e=>e.code==='CARRIER_REJECTED');
 const f=await fixture();t.after(f.close);const accepted=await f.service.create(input(),context);
 const own={...f.carrier,info:async()=>({})},after=service(f,own);
 const result=await after.syncOrders();assert.equal(result.updated,0);assert.equal(result.unavailable,1);
 const [row]=await f.db.query('SELECT status,carrier_state FROM orders WHERE id=$1',[accepted.orderId]);
 assert.equal(row.status,'accepted');assert.equal(row.carrier_state,'tracking_unavailable');
 assert.equal(Number((await after.metrics()).orders.tracking_unavailable),1);
 assert.equal((await f.db.query("SELECT * FROM meta_event_outbox WHERE event_name='Purchase'")).length,1);
});