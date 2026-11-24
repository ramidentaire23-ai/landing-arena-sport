'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {fixture,input,context}=require('./helpers');
const {createMaintenance}=require('../server/maintenance');
const {createApp}=require('../server');

test('Meta retry still sends a queued real-shaped fixture event when both NOEST jobs fail',async t=>{
 const f=await fixture({env:{META_CAPI_ACCESS_TOKEN:'fixture-only'},fetcher:async()=>new Response(JSON.stringify({events_received:1}),{status:200})});
 t.after(f.close);
 await f.service.create(input(),context);
 f.carrier.references=async()=>{throw new Error('NOEST_DOWN');};
 f.carrier.info=async()=>{throw new Error('NOEST_DOWN');};
 const result=await f.service.runMaintenance({force:true,includeReferences:true});
 assert.equal(result.ok,false);assert.equal(result.jobs.meta.ok,true);
 assert.equal(result.jobs.references.error,'REFERENCE_REFRESH_FAILED');
 assert.equal(result.jobs.carrier.error,'CARRIER_SYNC_FAILED');
 assert.equal((await f.db.query('SELECT state FROM meta_event_outbox'))[0].state,'sent');
});

test('shared leases suppress duplicate maintenance across instances and later visits',async t=>{
 const f=await fixture();t.after(f.close);
 let polls=0,sends=0;
 const tasks={db:f.db,refreshReferences:async()=>({}),syncOrders:async()=>{polls++;return {updated:0};},flushEvents:async()=>{sends++;return {sent:0,failed:0};}};
 const a=createMaintenance(tasks),b=createMaintenance(tasks);
 await Promise.all([a.run(),b.run()]);
 await a.run();assert.equal(polls,1);assert.equal(sends,1);
 assert.equal((await f.db.query('SELECT * FROM integration_jobs')).length,2);
});

test('a delivery queued during carrier sync gets a bounded post-sync send',async t=>{
 const f=await fixture();t.after(f.close);
 let calls=0;
 const worker=createMaintenance({db:f.db,refreshReferences:async()=>({}),syncOrders:async()=>({updated:1}),flushEvents:async()=>({sent:++calls===2?1:0,failed:0})});
 const result=await worker.run();
 assert.equal(calls,2);assert.equal(result.jobs.deliveryEvents.result.sent,1);
});

test('preview blocks private reads, orders, jobs and background work before touching dependencies',async t=>{
 const forbidden=()=>{throw new Error('LIVE_DEPENDENCY_CALLED');};
 let backgrounds=0;
 const service={getReferences:forbidden,create:forbidden,receipt:forbidden,metrics:forbidden,runMaintenance:forbidden};
 const server=createApp({env:{VERCEL:'1',VERCEL_ENV:'preview',CRON_SECRET:'fixture'},service,background:()=>backgrounds++}).listen(0);
 t.after(()=>new Promise(r=>server.close(r)));const base='http://localhost:'+server.address().port;
 assert.equal((await (await fetch(base+'/api/products')).json()).orderingEnabled,false);
 assert.equal((await (await fetch(base+'/api/health')).json()).orderingEnabled,false);
 for(const route of ['/api/delivery','/api/internal/metrics','/api/internal/reconcile'])assert.equal((await fetch(base+route)).status,503);
 for(const route of ['/api/orders','/api/orders/receipt'])assert.equal((await fetch(base+route,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,503);
 assert.equal(backgrounds,0);
});

test('attribution observation time is retained with a valid fixture order',async t=>{
 const f=await fixture();t.after(f.close);
 const server=createApp({service:f.service,env:{},background:()=>{}}).listen(0);
 t.after(()=>new Promise(r=>server.close(r)));const observedAt=Date.now()-60000;
 const res=await fetch('http://localhost:'+server.address().port+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...input(),attribution:{utm_source:'facebook',utm_campaign:'fixture',observedAt}})});
 assert.equal(res.status,201);
 const [{event_context:stored}]=await f.db.query('SELECT event_context FROM orders');
 assert.equal(stored.attribution_observed_at,new Date(observedAt).toISOString());
 assert.equal(stored.utm_campaign,'fixture');
});

test('UTM-only visits replace stale ad labels and keep the context timestamp',()=>{
 const memory=new Map([['arena_attribution_v1',JSON.stringify({ad_id:'old-ad',observedAt:Date.now()})]]);
 const doc={cookie:'',addEventListener:()=>{}},window={};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets/js/tracking.js'),'utf8'),{window,document:doc,location:{search:'?utm_source=instagram&utm_campaign=fixture',protocol:'https:'},URLSearchParams,Date,localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)}});
 const actual=window.ArenaTracking.get();
 assert.equal(actual.utm_source,'instagram');assert.equal(actual.utm_campaign,'fixture');
 assert.equal(actual.ad_id,undefined);assert.ok(Number.isFinite(actual.observedAt));
});

test('production pixel bootstrap is inert on localhost and immutable preview hosts',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../assets/js/pixel.js'),'utf8');
 for(const hostname of ['localhost','127.0.0.1','landing-arena-sport-preview.vercel.app']){
  const win={};vm.runInNewContext(source,{location:{hostname},window:win,document:{createElement:()=>{throw new Error('PREVIEW_PIXEL_LOADED');}}});
  assert.equal(win.fbq,undefined);
 }
 let added=0;const win={};const script={parentNode:{insertBefore:()=>added++}};
 vm.runInNewContext(source,{location:{hostname:'landing-arena-sport.vercel.app'},window:win,document:{createElement:()=>({}),getElementsByTagName:()=>[script]}});
 assert.equal(added,1);assert.equal(win.fbq.queue.length,1);
 assert.deepEqual(Array.from(win.fbq.queue[0]),['init','1422859033068055']);
});

