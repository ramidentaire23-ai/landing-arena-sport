'use strict';
const {createHash}=require('node:crypto');
class CarrierError extends Error{
 constructor(code,uncertain=false){super(code);this.code=code;this.uncertain=uncertain;}
}
function createCarrier(env=process.env,fetcher=fetch){
 const configured=()=>!!(env.NOEST_API_TOKEN&&env.NOEST_USER_GUID);
 async function request(endpoint,body){
  if(!configured())throw new CarrierError('CARRIER_NOT_CONFIGURED');
  const url=new URL(endpoint,env.NOEST_API_URL||'https://app.noest-dz.com');
  if(!body)url.searchParams.set('user_guid',env.NOEST_USER_GUID);
  let res,data;
  try{
   res=await fetcher(url,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+env.NOEST_API_TOKEN,'Content-Type':'application/json'},
    ...(body?{body:JSON.stringify({...body,user_guid:env.NOEST_USER_GUID})}:{}),signal:AbortSignal.timeout(20000)});
   data=await res.json();
  }catch{throw new CarrierError('CARRIER_RESPONSE_UNKNOWN',true);}
  if(res.status>=500)throw new CarrierError('CARRIER_RESPONSE_UNKNOWN',true);
  if(!res.ok)throw new CarrierError('CARRIER_REJECTED');
  return data;
 }
 return {configured,
  accountKey:()=>createHash('sha256').update('noest:'+String(env.NOEST_API_URL||'https://app.noest-dz.com')+':'+String(env.NOEST_USER_GUID||'').trim()).digest('hex'),
  async create(o){
   const data=await request('/api/public/create/order',{reference:o.reference,client:o.clientName,phone:o.phone,
    adresse:String(o.address).slice(0,255),wilaya_id:o.wilayaId,commune:o.commune,montant:o.total,produit:o.variant.name_fr+' x'+o.quantity,
    type_id:1,stop_desk:o.deliveryType==='desk'?1:0,...(o.deliveryType==='desk'?{station_code:o.stationCode}:{}),
    stock:0,shop_name:'Arena Sport',remarque:'Confirmation téléphonique avant validation.'});
   if(!data||typeof data!=='object'||Array.isArray(data))throw new CarrierError('CARRIER_RESPONSE_UNKNOWN',true);
   if(data.success===true&&typeof data.tracking==='string'&&data.tracking.trim())return data.tracking.trim();
   if(/duplicate_order|déja existant|déjà existant/i.test(JSON.stringify(data)))throw new CarrierError('CARRIER_DUPLICATE_REQUIRES_REVIEW',true);
   if(data.success===true||(!('success' in data)&&!data.error&&!data.errors&&!data.message))throw new CarrierError('CARRIER_RESPONSE_UNKNOWN',true);
   throw new CarrierError('CARRIER_REJECTED');
  },
  info:trackings=>request('/api/public/get/trackings/info',{trackings}),
  async references(){
   const wilayas=await request('/api/public/get/wilayas'),rawCommunes=await request('/api/public/get/communes'),
    desks=await request('/api/public/desks'),fees=await request('/api/public/fees');
   const communes=Array.isArray(rawCommunes)?rawCommunes:Object.values(rawCommunes||{}).filter(c=>c&&typeof c==='object'&&c.wilaya_id);
   if(!Array.isArray(wilayas)||!communes.length||!desks||!fees.tarifs?.delivery)throw new CarrierError('CARRIER_REFERENCE_INVALID');
   return {wilayas,communes,desks,fees:fees.tarifs.delivery};
  }};
}
module.exports={createCarrier,CarrierError};
