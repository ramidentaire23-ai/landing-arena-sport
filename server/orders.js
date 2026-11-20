'use strict';
const {hash,UUID,publicReferences,priceOrder,metaEvent,eventDate,historyKey}=require('./domain');
function createOrderService({db,carrier,legacyCarrier=null,env=process.env,fetcher=fetch,now=()=>new Date()}){
 const accountKey=carrier.accountKey?.()||'current',legacyKey=legacyCarrier?.accountKey?.()||null;
 const referenceCacheKey='account:'+accountKey;
 function carrierFor(order){
  // Untagged orders predate account routing and belong to the retained old account.
  const key=order.carrierAccountKey||legacyKey||accountKey;
  if(key===accountKey)return carrier;
  if(legacyCarrier&&key===legacyKey)return legacyCarrier;
  throw Object.assign(new Error('ORDER_CARRIER_ACCOUNT_UNAVAILABLE'),{status:409});
 }
 async function refreshReferences(){
  const raw=await carrier.references(),clean=publicReferences(raw);
  if(!clean.wilayas.length)throw new Error('NO_SERVICEABLE_WILAYAS');
  await db.query("INSERT INTO noest_reference_cache(id,payload,fetched_at) VALUES($1,$2,$3) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,fetched_at=excluded.fetched_at",[referenceCacheKey,JSON.stringify(raw),now()]);
  return clean;
 }
 async function getReferences(){
  const [row]=await db.query('SELECT payload,fetched_at FROM noest_reference_cache WHERE id=$1',[referenceCacheKey]);
  return !row||now()-new Date(row.fetched_at)>86400000?refreshReferences():publicReferences(row.payload);
 }
 function response(row){
  return {orderId:row.id,reference:row.reference,status:row.status,tracking:row.tracking||null,
   ...(row.status==='accepted'?{eventId:'purchase:'+row.id}:{})};
 }
 async function accept(row,tracking,acceptedAt=now()){
  const order={...row.order_data,id:row.id,reference:row.reference};
  const payload=metaEvent(order,row.event_context,'Purchase',acceptedAt);
  await db.transaction([
   {text:"UPDATE orders SET status='accepted',tracking=$2,accepted_at=$3,rejection_code=NULL WHERE id=$1 AND status IN ('creating','pending')",values:[row.id,tracking,acceptedAt]},
   {text:"INSERT INTO meta_event_outbox(event_id,order_id,event_name,payload) VALUES($1,$2,'Purchase',$3) ON CONFLICT(event_id) DO NOTHING",values:[payload.event_id,row.id,JSON.stringify(payload)]}
  ]);
  return {...row,status:'accepted',tracking,accepted_at:acceptedAt};
 }
 function inputHash(input){
  const keys=['clientName','phone','variantId','quantity','wilayaId','deliveryType','stationCode','communeZip','address'];
  return hash(JSON.stringify(keys.map(k=>input[k]??null))+hash(input.receiptToken));
 }
 async function create(input,context){
  if(!UUID.test(input.idempotencyKey||'')||!/^[a-zA-Z0-9_-]{43,128}$/.test(input.receiptToken||''))throw Object.assign(new Error('INVALID_REQUEST_ID'),{status:422});
  const id=input.idempotencyKey,requestHash=inputHash(input);
  // Resolve retries before pricing/refetching: the original quote is immutable.
  const [prior]=await db.query('SELECT * FROM orders WHERE id=$1',[id]);
  if(prior){
   if(prior.request_hash!==requestHash)throw Object.assign(new Error('IDEMPOTENCY_CONFLICT'),{status:409});
   return response(prior.status==='creating'?{...prior,status:'pending'}:prior);
  }
  if(!carrier.configured())throw new Error('CARRIER_NOT_CONFIGURED');
  const order={...priceOrder(input,await getReferences()),carrierAccountKey:accountKey},reference='ARENA-'+id;
  const rows=await db.query("INSERT INTO orders(id,reference,request_hash,receipt_hash,status,order_data,event_context) VALUES($1,$2,$3,$4,'creating',$5,$6) ON CONFLICT(id) DO NOTHING RETURNING *",
   [id,reference,requestHash,hash(input.receiptToken),JSON.stringify(order),JSON.stringify(context)]);
  if(!rows.length)return create(input,context);
  let tracking;
  try{tracking=await carrier.create({...order,reference});}
  catch(e){
   const status=e.uncertain?'pending':'rejected';
   await db.query('UPDATE orders SET status=$2,rejection_code=$3 WHERE id=$1',[id,status,e.code||'CARRIER_REJECTED']);
   return response({...rows[0],status});
  }
  // A database failure after carrier acceptance leaves the durable intent in place.
  return response(await accept(rows[0],tracking));
 }
 async function receipt(id,token){
  if(!UUID.test(id||'')||typeof token!=='string'||token.length>128)return null;
  const [row]=await db.query('SELECT * FROM orders WHERE id=$1 AND receipt_hash=$2',[id,hash(token)]);
  if(!row)return null;
  if(row.status!=='accepted')return response(row);
  return {...response(row),order:row.order_data,acceptedAt:row.accepted_at,
   browserPurchaseEligible:now()-new Date(row.accepted_at)<86400000,
   purchase:metaEvent({...row.order_data,id:row.id},row.event_context,'Purchase',row.accepted_at).custom_data};
 }
 async function flushEvents(limit=20,onlyOrderId=null){
  if(!env.META_ACCESS_TOKEN&&!env.META_CAPI_ACCESS_TOKEN)return {sent:0,waitingForConfiguration:true};
  const candidates=await db.query("SELECT event_id FROM meta_event_outbox WHERE state='pending' AND next_attempt_at<=now() AND (locked_until IS NULL OR locked_until<now()) AND ($1::uuid IS NULL OR order_id=$1) ORDER BY created_at LIMIT $2",[onlyOrderId,limit]);
  let sent=0;
  for(const item of candidates){
   const [entry]=await db.query("UPDATE meta_event_outbox SET locked_until=now()+interval '2 minutes',attempts=attempts+1 WHERE event_id=$1 AND state='pending' AND (locked_until IS NULL OR locked_until<now()) RETURNING *",[item.event_id]);
   if(!entry)continue;
   if(now().getTime()/1000-entry.payload.event_time>6*86400){
    await db.query("UPDATE meta_event_outbox SET state='dead',last_error_code='EVENT_TOO_OLD',locked_until=NULL WHERE event_id=$1",[entry.event_id]);continue;
   }
   try{
    const version=/^v\d+\.\d+$/.test(env.META_API_VERSION||'')?env.META_API_VERSION:'v25.0';
    const body={data:[entry.payload],access_token:env.META_ACCESS_TOKEN||env.META_CAPI_ACCESS_TOKEN};
    if(env.META_TEST_EVENT_CODE)body.test_event_code=env.META_TEST_EVENT_CODE;
    const res=await fetcher('https://graph.facebook.com/'+version+'/'+(env.META_PIXEL_ID||'1422859033068055')+'/events',
     {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
    const result=await res.json();
    if(!res.ok||Number(result.events_received)!==1)throw new Error('META_EVENT_NOT_ACCEPTED');
    await db.query("UPDATE meta_event_outbox SET state='sent',sent_at=now(),locked_until=NULL,last_error_code=NULL WHERE event_id=$1",[entry.event_id]);sent++;
   }catch{
    await db.query("UPDATE meta_event_outbox SET locked_until=NULL,last_error_code='META_SEND_FAILED',next_attempt_at=now()+interval '5 minutes' WHERE event_id=$1",[entry.event_id]);
   }
  }
  return {sent};
 }
 async function reconcilePending(id,tracking){
  if(!UUID.test(id||'')||typeof tracking!=='string')throw Object.assign(new Error('INVALID_REQUEST'),{status:422});
  const [row]=await db.query("SELECT * FROM orders WHERE id=$1 AND status IN ('creating','pending')",[id]);
  if(!row)throw Object.assign(new Error('PENDING_ORDER_NOT_FOUND'),{status:404});
  const data=await carrierFor(row.order_data).info([tracking]),info=data[tracking]?.OrderInfo;
  if(!info||info.reference!==row.reference||Number(info.montant)!==row.order_data.total)throw Object.assign(new Error('TRACKING_DOES_NOT_MATCH'),{status:409});
  return response(await accept(row,tracking,eventDate(info.created_at)||now()));
 }
 async function syncOrders(){
  const rows=await db.query("SELECT * FROM orders WHERE status='accepted' AND tracking IS NOT NULL AND created_at>now()-interval '120 days' ORDER BY last_polled_at NULLS FIRST LIMIT 100");
  let updated=0;
  const accounts=new Map();
  for(const row of rows){const owner=carrierFor(row.order_data);if(!accounts.has(owner))accounts.set(owner,[]);accounts.get(owner).push(row);}
  for(const [owner,accountRows]of accounts){
  for(let i=0;i<accountRows.length;i+=25){
   const batch=accountRows.slice(i,i+25),info=await owner.info(batch.map(r=>r.tracking));
   for(const row of batch){
    const record=info[row.tracking];if(!record||record.OrderInfo?.reference!==row.reference)continue;
    const events=(record.activity||[]).map(raw=>({raw,key:historyKey(raw),time:eventDate(raw.date)})).sort((a,b)=>(a.time||'').localeCompare(b.time||''));
    let state='created',deliveredAt=row.delivered_at,paidAt=row.paid_at,dispatchedAt=row.dispatched_at;
    for(const e of events){
     await db.query('INSERT INTO noest_history(event_hash,order_id,event_key,event_time,raw) VALUES($1,$2,$3,$4,$5) ON CONFLICT(event_hash) DO NOTHING',[hash(row.id+JSON.stringify(e.raw)),row.id,e.key,e.time,JSON.stringify(e.raw)]);
     if(['livre','livred'].includes(e.key)){state='delivered';deliveredAt=deliveredAt||e.time;}
     else if(['return_asked_by_hub','return_asked_by_customer','retour_dispatched_to_partenaires','return_dispatched_to_partenaire'].includes(e.key))state='returning';
     else if(['colis_retour_transmit_to_partner','livraison_echoue_recu','return_validated_by_partener'].includes(e.key))state='returned';
     else if(['validation_collect_colis','validation_reception_admin','validation_reception'].includes(e.key)){state='in_transit';dispatchedAt=dispatchedAt||e.time;}
     else if(['annulation_dispatch_retour','cancel_return_dispatched_to_partenaire'].includes(e.key))state='review';
     else if(e.key==='colis_suspendu')state='suspended';
     else if(['fdr_activated','return_redispatched_to_livraison'].includes(e.key))state='in_delivery';
     else if(e.key==='customer_validation'&&state==='created')state='validated';
     else if(e.key==='validation_reception_cash_by_partener')paidAt=paidAt||e.time;
    }
    const statements=[{text:'UPDATE orders SET carrier_state=$2,delivered_at=$3,paid_at=$4,dispatched_at=$5,last_polled_at=now() WHERE id=$1',values:[row.id,state,deliveredAt,paidAt,dispatchedAt]}];
    if(deliveredAt&&env.DELIVERY_EVENTS_ENABLED==='true'){
     const payload=metaEvent({...row.order_data,id:row.id},row.event_context,'OrderDelivered',deliveredAt);
     statements.push({text:"INSERT INTO meta_event_outbox(event_id,order_id,event_name,payload) VALUES($1,$2,'OrderDelivered',$3) ON CONFLICT(event_id) DO NOTHING",values:[payload.event_id,row.id,JSON.stringify(payload)]});
    }
    await db.transaction(statements);updated++;
   }
  }
  }
  return {updated};
 }
 async function metrics(){
  const [orders]=await db.query("SELECT count(*) AS submitted,count(*) FILTER(WHERE status='accepted') AS accepted,count(*) FILTER(WHERE status IN ('creating','pending')) AS pending,count(*) FILTER(WHERE dispatched_at IS NOT NULL OR carrier_state IN ('in_transit','in_delivery','delivered','returned')) AS dispatched,count(*) FILTER(WHERE carrier_state='delivered') AS currently_delivered,count(*) FILTER(WHERE carrier_state='returned') AS returned,count(*) FILTER(WHERE carrier_state='returning') AS returning,count(*) FILTER(WHERE paid_at IS NOT NULL) AS payment_received FROM orders");
  const events=await db.query('SELECT state,count(*) AS count FROM meta_event_outbox GROUP BY state');return {orders,events};
 }
 return {create,receipt,getReferences,refreshReferences,flushEvents,syncOrders,reconcilePending,metrics};
}
module.exports={createOrderService};
