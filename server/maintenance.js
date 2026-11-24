'use strict';
const {randomUUID}=require('node:crypto');

// The lease is shared by function instances. A page visit can wake due work
// without polling NOEST once per visitor or submitting an order twice.
function createMaintenance({db,refreshReferences,syncOrders,flushEvents}){
 async function job(name,intervalSeconds,task,force){
  const token=randomUUID();
  const [lease]=await db.query(`INSERT INTO integration_jobs(name,lease_token,lease_until,last_started_at)
   VALUES($1,$2,now()+interval '6 minutes',now())
   ON CONFLICT(name) DO UPDATE SET lease_token=$2,lease_until=now()+interval '6 minutes',last_started_at=now()
   WHERE (integration_jobs.lease_until IS NULL OR integration_jobs.lease_until<now())
   AND ($3::boolean OR integration_jobs.next_run_at<=now()) RETURNING name`,[name,token,force]);
  if(!lease)return {skipped:true};
  try{
   const result=await task();
   if(result?.failed||result?.waitingForConfiguration)throw new Error('INTEGRATION_RETRY_REQUIRED');
   await db.query(`UPDATE integration_jobs SET lease_token=NULL,lease_until=NULL,
    next_run_at=now()+$3::integer*interval '1 second',last_completed_at=now(),last_error_code=NULL
    WHERE name=$1 AND lease_token=$2`,[name,token,intervalSeconds]);
   return {ok:true,result};
  }catch{
   const code=name==='carrier'?'CARRIER_SYNC_FAILED':name==='references'?'REFERENCE_REFRESH_FAILED':'META_RETRY_FAILED';
   await db.query(`UPDATE integration_jobs SET lease_token=NULL,lease_until=NULL,
    next_run_at=now()+interval '1 minute',last_error_code=$3 WHERE name=$1 AND lease_token=$2`,[name,token,code]);
   console.error('[integrations]',code);
   return {ok:false,error:code};
  }
 }
 async function run({force=false,includeReferences=false}={}){
  const tasks={carrier:()=>job('carrier',900,syncOrders,force),meta:()=>job('meta',60,()=>flushEvents(),force)};
  if(includeReferences)tasks.references=()=>job('references',86400,refreshReferences,force);
  const results=await Promise.all(Object.entries(tasks).map(async([name,task])=>{
   try{return [name,await task()];}
   catch{console.error('[integrations] JOB_STORAGE_FAILED');return [name,{ok:false,error:'JOB_STORAGE_FAILED'}];}
  }));
  const jobs=Object.fromEntries(results);
  // A delivery found by NOEST may have been queued after the first Meta pass.
  // Sending is independently locked by event ID, so this cannot emit it twice.
  if(jobs.carrier.ok&&jobs.carrier.result.updated){
   try{jobs.deliveryEvents={ok:true,result:await flushEvents()};}
   catch{jobs.deliveryEvents={ok:false,error:'META_RETRY_FAILED'};}
   if(jobs.deliveryEvents.result?.failed||jobs.deliveryEvents.result?.waitingForConfiguration)jobs.deliveryEvents.ok=false;
  }
  return {ok:Object.values(jobs).every(j=>j.ok!==false),jobs};
 }
 return {run};
}
module.exports={createMaintenance};
