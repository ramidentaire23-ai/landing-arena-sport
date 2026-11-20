'use strict';
const {fixture}=require('./helpers');
const {createApp}=require('../server');
(async()=>{
 const f=await fixture();
 const app=createApp({service:f.service,env:{CRON_SECRET:'fixture-only'},background:()=>{}});
 app.get('/__fixture/status',(req,res)=>res.json({carrierCalls:f.calls.length}));
 const server=app.listen(3100,()=>console.log('Local fixture server ready on 3100; no live NOEST or Meta requests.'));
 async function stop(){server.close();await f.close();process.exit();}
 process.on('SIGTERM',stop);process.on('SIGINT',stop);
})();
