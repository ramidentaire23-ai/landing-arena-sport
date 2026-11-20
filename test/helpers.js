'use strict';
const {PGlite}=require('@electric-sql/pglite');
const {migrate}=require('../server/db');
const {createOrderService}=require('../server/orders');
const {CarrierError}=require('../server/carrier');
const {randomUUID,randomBytes}=require('node:crypto');
const references={
 wilayas:[{code:1,nom:'Adrar',is_active:1},{code:10,nom:'Bouira',is_active:1},{code:16,nom:'Alger',is_active:1},{code:49,nom:'Timimoun',is_active:1}],
 communes:[{nom:'Alger Centre',wilaya_id:16,code_postal:'16001',is_active:1},{nom:'Inactive',wilaya_id:16,code_postal:'16002',is_active:0},{nom:'Timimoun',wilaya_id:49,code_postal:'49000',is_active:1}],
 desks:{'01A':{code:'1A',name:'Adrar',address:'Bureau Adrar',commune:'Adrar'},'10A':{code:'10A',name:'Bouira',address:'Bureau Bouira',commune:'Bouira'},'16A':{code:'16A',name:'Alger Centre',address:'Bureau Alger Centre',commune:'Alger Centre'},'49A':{code:'49A',name:'Timimoun',address:'Bureau Timimoun',commune:'Timimoun'}},
 fees:{1:{tarif:'800',tarif_stopdesk:'500'},10:{tarif:'800',tarif_stopdesk:'500'},16:{tarif:'700',tarif_stopdesk:'450'},49:{tarif:'0',tarif_stopdesk:'0'}}
};
function input(extra={}){return {idempotencyKey:randomUUID(),receiptToken:randomBytes(32).toString('base64url'),clientName:'Test Arena',phone:'+213 660 000 001',variantId:'black_red',quantity:1,wilayaId:16,deliveryType:'desk',stationCode:'16A',...extra};}
const context={event_source_url:'https://arena.example/',client_user_agent:'TestBrowser',client_ip_address:'8.8.8.8',fbc:'fb.1.1795160000000.REAL_CLICK',fbp:'fb.1.1795160000000.123456'};
async function fixture(extra={}){
 const pg=await PGlite.create();
 const db={query:async(text,values=[])=> (await pg.query(text,values)).rows,
  transaction:statements=>pg.transaction(async tx=>{const results=[];for(const s of statements)results.push((await tx.query(s.text,s.values||[])).rows);return results;})};
 await migrate(db);
 const calls=[],infos={};
 const carrier={configured:()=>true,references:async()=>references,
  create:async o=>{calls.push(o);if(o.clientName.startsWith('Reject'))throw new CarrierError('CARRIER_REJECTED');if(o.clientName.startsWith('Pending'))throw new CarrierError('CARRIER_RESPONSE_UNKNOWN',true);
   const tracking='TEST-'+o.reference;infos[tracking]={OrderInfo:{reference:o.reference,montant:o.total},activity:[]};return tracking;},
  info:async trackings=>Object.fromEntries(trackings.filter(t=>infos[t]).map(t=>[t,infos[t]]))};
 const service=createOrderService({db,carrier,env:{},fetcher:async()=>{throw new Error('EXTERNAL_REQUEST_FORBIDDEN_IN_FIXTURE');},...extra});
 return {pg,db,carrier,calls,infos,service,close:()=>pg.close()};
}
module.exports={fixture,input,context,references};
