'use strict';
const path=require('node:path');
require('dotenv').config({path:path.join(__dirname,'../.env.local'),quiet:true});
require('dotenv').config({quiet:true});
const express=require('express'),crypto=require('node:crypto'),{isIP}=require('node:net');
const {getDatabase}=require('./db'),{createCarrier}=require('./carrier'),{createOrderService}=require('./orders'),{VARIANTS}=require('./domain');
function requestOrigin(req,env){return (env.VERCEL?'https':req.protocol)+'://'+String(req.headers.host||'localhost');}
function eventContext(req,env){
 const cookies=Object.fromEntries(String(req.headers.cookie||'').split(';').map(p=>{const i=p.indexOf('=');return i<0?[]:[p.slice(0,i).trim(),p.slice(i+1)];}).filter(p=>p.length===2));
 const input=req.body.attribution||{},context={};
 for(const key of ['fbc','fbp']){
  const value=cookies['_'+key]||input[key];
  if(typeof value==='string'&&/^fb\.\d\.\d{13}\.[^\s;]{1,500}$/.test(value))context[key]=value;
 }
 const ip=String(req.headers['x-real-ip']||req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();
 if(isIP(ip))context.client_ip_address=ip;
 context.client_user_agent=String(req.headers['user-agent']||'').slice(0,1024);
 const base=requestOrigin(req,env);
 try{const url=new URL(req.body.eventSourceUrl||'/',base);context.event_source_url=url.origin===base?url.href.slice(0,2048):base+'/';}
 catch{context.event_source_url=base+'/';}
 for(const key of ['campaign_id','adset_id','ad_id','utm_source','utm_medium','utm_campaign','utm_content','placement','fbclid'])
  if(typeof input[key]==='string')context[key]=input[key].slice(0,500);
 return context;
}
function createApp(options={}){
 const env=options.env||process.env,app=express();app.disable('x-powered-by');
 app.use(express.json({limit:'24kb'}));
 let service=options.service;
 const getService=()=>service||(service=createOrderService({db:getDatabase(),carrier:createCarrier(env),legacyCarrier:env.NOEST_LEGACY_USER_GUID&&env.NOEST_LEGACY_API_TOKEN?createCarrier({...env,NOEST_USER_GUID:env.NOEST_LEGACY_USER_GUID,NOEST_API_TOKEN:env.NOEST_LEGACY_API_TOKEN}):null,env}));
 const background=options.background||(task=>{
  const safe=task().catch(()=>console.error('[orders] BACKGROUND_TASK_FAILED'));
  if(env.VERCEL)require('@vercel/functions').waitUntil(safe);
 });
 app.use('/api',(req,res,next)=>{
  res.set('Cache-Control','no-store');res.set('X-Content-Type-Options','nosniff');
  if(!['GET','HEAD'].includes(req.method)&&req.headers.origin&&req.headers.origin!==requestOrigin(req,env))return res.status(403).json({error:'ORIGIN_NOT_ALLOWED'});
  next();
 });
 app.get('/api/health',(req,res)=>res.json({ok:true,ordersConfigured:!!env.DATABASE_URL&&!!env.NOEST_API_TOKEN&&!!env.NOEST_USER_GUID}));
 app.get('/api/products',(req,res)=>res.json({unitPrice:2900,variants:Object.values(VARIANTS)}));
 app.get('/api/delivery',async(req,res,next)=>{try{res.json(await getService().getReferences());}catch(e){next(e);}});
 app.post('/api/orders',async(req,res,next)=>{
  try{
   const result=await getService().create(req.body,eventContext(req,env));
   if(result.status==='accepted')background(()=>getService().flushEvents(1,result.orderId));
   res.status(result.status==='accepted'?201:result.status==='rejected'?422:202).json(result);
  }catch(e){next(e);}
 });
 app.post('/api/orders/receipt',async(req,res,next)=>{
  try{const receipt=await getService().receipt(req.body.orderId,req.body.receiptToken);
   if(!receipt)return res.status(404).json({error:'RECEIPT_NOT_FOUND'});res.json(receipt);
  }catch(e){next(e);}
 });
 function internal(req,res,next){
  const supplied=Buffer.from(req.headers.authorization||''),expected=Buffer.from('Bearer '+(env.CRON_SECRET||''));
  if(!env.CRON_SECRET||supplied.length!==expected.length||!crypto.timingSafeEqual(supplied,expected))return res.status(401).json({error:'UNAUTHORIZED'});
  next();
 }
 app.get('/api/internal/metrics',internal,async(req,res,next)=>{try{res.json(await getService().metrics());}catch(e){next(e);}});
 app.get('/api/internal/reconcile',internal,async(req,res,next)=>{
  try{await getService().refreshReferences();const carrier=await getService().syncOrders(),meta=await getService().flushEvents();res.json({carrier,meta});}catch(e){next(e);}
 });
 app.post('/api/internal/reconcile-order',internal,async(req,res,next)=>{
  try{res.json(await getService().reconcilePending(req.body.orderId,req.body.tracking));}catch(e){next(e);}
 });
 app.use('/api',(req,res)=>res.status(404).json({error:'NOT_FOUND'}));
 app.use('/assets',express.static(path.join(__dirname,'../assets'),{dotfiles:'deny'}));
 app.get(['/','/index.html'],(req,res)=>res.sendFile(path.join(__dirname,'../index.html')));
 app.get(['/merci','/merci.html'],(req,res)=>{res.set('Cache-Control','no-store');res.sendFile(path.join(__dirname,'../merci.html'));});
 app.use((req,res)=>res.status(404).send('Not found'));
 app.use((err,req,res,next)=>{
  if(res.headersSent)return next(err);
  const validation=[400,409,422].includes(err.status);
  if(!validation)console.error('[orders]',/^[A-Z_]+$/.test(err.message)?err.message:'DEPENDENCY_FAILED');
  res.status(validation?err.status:503).json({error:validation?err.message:'SERVICE_UNAVAILABLE',...(validation&&err.field?{field:err.field}:{})});
 });
 return app;
}
const app=createApp();
if(require.main===module)app.listen(process.env.PORT||3000,()=>console.log('Arena Sport server ready'));
module.exports=app;module.exports.createApp=createApp;
