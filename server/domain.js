'use strict';
const crypto = require('node:crypto');
const VARIANTS = {
 "black_red": {
  "id": "black_red",
  "name_ar": "أسود / أحمر — 12 سنة فما فوق",
  "name_fr": "Noir/rouge — 12 ans et plus, branches et élastique",
  "color_ar": "أسود / أحمر",
  "color_fr": "Noir & rouge",
  "ageGroup": "12_plus",
  "ageLabelAr": "12 سنة فما فوق",
  "equipmentAr": "أذرع ورباط",
  "catalogId": "ar1x5xmsm1",
  "photos": [
   "assets/images/black-red-1.jpg",
   "assets/images/black-red-2.jpg"
  ]
 },
 "transparent": {
  "id": "transparent",
  "name_ar": "شفاف — 12 سنة فما فوق",
  "name_fr": "Transparent — 12 ans et plus, branches et élastique",
  "color_ar": "شفاف",
  "color_fr": "Transparent",
  "ageGroup": "12_plus",
  "ageLabelAr": "12 سنة فما فوق",
  "equipmentAr": "أذرع ورباط",
  "catalogId": "ffbmkg09sl",
  "photos": [
   "assets/images/transparent-1.jpg",
   "assets/images/transparent-2.jpg"
  ]
 },
 "kids_black": {
  "id": "kids_black",
  "name_ar": "أسود للأطفال — من 5 إلى 11 سنة",
  "name_fr": "Noir enfant — 5 à 11 ans, élastique uniquement",
  "color_ar": "أسود",
  "color_fr": "Noir",
  "ageGroup": "kids_5_11",
  "ageLabelAr": "من 5 إلى 11 سنة",
  "equipmentAr": "رباط فقط، بدون أذرع",
  "catalogId": "y8eweapeo0",
  "photos": [
   "assets/images/kids-black-1.jpg",
   "assets/images/kids-black-2.jpg"
  ]
 },
 "kids_transparent": {
  "id": "kids_transparent",
  "name_ar": "شفاف للأطفال — من 5 إلى 11 سنة",
  "name_fr": "Transparent enfant — 5 à 11 ans, élastique uniquement",
  "color_ar": "شفاف",
  "color_fr": "Transparent",
  "ageGroup": "kids_5_11",
  "ageLabelAr": "من 5 إلى 11 سنة",
  "equipmentAr": "رباط فقط، بدون أذرع",
  "catalogId": "cb1ztgr1vc",
  "photos": [
   "assets/images/kids-transparent-1.jpg",
   "assets/images/kids-transparent-2.jpg"
  ]
 }
};
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function normalizePhone(value) {
 let s=String(value||'').replace(/[\s().-]/g,'');
 if(s.startsWith('00213')) s='0'+s.slice(5);
 else if(s.startsWith('+213')) s='0'+s.slice(4);
 else if(/^213[567]/.test(s)) s='0'+s.slice(3);
 return /^0[567]\d{8}$/.test(s)?s:null;
}
function fail(field) { throw Object.assign(new Error('INVALID_ORDER'),{status:422,field}); }
function deskWilaya(code) { return Number(String(code).match(/^0?(\d{1,2})[A-Za-z]/)?.[1]); }
function publicReferences(ref) {
 const fee=value=>value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value))&&Number(value)>=0?Number(value):null;
 return {wilayas:ref.wilayas.filter(w=>Number(w.is_active)===1).map(w=>{
  const id=Number(w.code??w.id),fees=ref.fees[id];
  return {id,name:w.nom,homeFee:fees?fee(fees.tarif):null,deskFee:fees?fee(fees.tarif_stopdesk):null,
   communes:ref.communes.filter(c=>Number(c.wilaya_id)===id&&Number(c.is_active)===1).map(c=>({name:c.nom,zip:c.code_postal})),
   desks:Object.values(ref.desks).filter(d=>deskWilaya(d.code)===id).map(d=>({code:d.code,name:d.name,address:d.address,commune:d.commune||''}))};
 }).filter(w=>Number.isFinite(w.homeFee)||Number.isFinite(w.deskFee))};
}
function priceOrder(input,refs) {
 const clientName=typeof input.clientName==='string'?input.clientName.trim():'';
 if(clientName.length<3||clientName.length>255) fail('clientName');
 const phone=normalizePhone(input.phone); if(!phone) fail('phone');
 const variant=VARIANTS[input.variantId]; if(!variant) fail('variantId');
 const quantity=input.quantity??1;
 if(!Number.isSafeInteger(quantity)||quantity<1||quantity>10) fail('quantity');
 const wilaya=refs.wilayas.find(w=>w.id===Number(input.wilayaId)); if(!wilaya) fail('wilayaId');
 if(!['home','desk'].includes(input.deliveryType)) fail('deliveryType');
 const shipping=input.deliveryType==='desk'?wilaya.deskFee:wilaya.homeFee;
 if(!Number.isFinite(shipping)||shipping<0) fail('deliveryType');
 let address,commune,stationCode='';
 if(input.deliveryType==='desk'){
  const desk=wilaya.desks.find(d=>d.code===input.stationCode); if(!desk) fail('stationCode');
  stationCode=desk.code;address=desk.address||desk.name;commune=desk.commune||wilaya.name;
 }else{
  const selected=wilaya.communes.find(c=>c.zip===input.communeZip);if(!selected)fail('communeZip');
  commune=selected.name;address=typeof input.address==='string'?input.address.trim():'';
  if(address.length<5||address.length>255)fail('address');
 }
 return {clientName,phone,variant,quantity,wilayaId:wilaya.id,wilayaName:wilaya.name,deliveryType:input.deliveryType,
  commune,address,stationCode,unitPrice:2900,subtotal:2900*quantity,shipping,total:2900*quantity+shipping};
}
function metaEvent(order,context,name,when) {
 const names=order.clientName.toLowerCase().trim().split(/\s+/);
 const user_data={ph:[hash('213'+order.phone.slice(1))],fn:[hash(names[0])],country:[hash('dz')],ct:[hash(order.commune.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,''))]};
 if(names.length>1)user_data.ln=[hash(names.slice(1).join(' '))];
 for(const key of ['fbc','fbp','client_ip_address','client_user_agent'])if(context[key])user_data[key]=context[key];
 return {event_name:name,event_time:Math.floor(new Date(when).getTime()/1000),
  event_id:(name==='Purchase'?'purchase:':'delivered:')+order.id,action_source:name==='Purchase'?'website':'system_generated',
  event_source_url:context.event_source_url,user_data,custom_data:{currency:'DZD',value:order.subtotal,
  content_type:'product',content_ids:[order.variant.catalogId],contents:[{id:order.variant.catalogId,quantity:order.quantity,item_price:2900}],num_items:order.quantity,order_id:order.id}};
}
function eventDate(value){
 if(!value)return null;
 const s=String(value),normalized=/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(s)?s.replace(' ','T')+'+01:00':s;
 const date=new Date(normalized);return Number.isNaN(date.getTime())?null:date.toISOString();
}
function historyKey(event){
 return event.event_key||({'Delivered':'livre','Livré':'livre','Uploaded to system':'upload','Validated':'customer_validation',
  'Out for delivery':'fdr_activated','Return received by partner':'livraison_echoue_recu','Amount received by partner':'validation_reception_cash_by_partener'}[event.event])||'unknown';
}
module.exports={VARIANTS,hash,UUID,normalizePhone,deskWilaya,publicReferences,priceOrder,metaEvent,eventDate,historyKey};
