(function(){
 'use strict';
 const storageKey='arena_attribution_v1',params=new URLSearchParams(location.search);
 function readCookie(name){return document.cookie.split('; ').find(p=>p.startsWith(name+'='))?.slice(name.length+1)||'';}
 function read(){try{return JSON.parse(localStorage.getItem(storageKey)||'{}');}catch{return {};}}
 const keys=['campaign_id','adset_id','ad_id','utm_source','utm_medium','utm_campaign','utm_content','placement','fbclid'];
 if(keys.some(key=>params.has(key))){
  const next={observedAt:Date.now()};
  keys.forEach(k=>{if(params.get(k))next[k]=params.get(k).slice(0,500);});
  if(next.fbclid){
   const previous=readCookie('_fbc');
   next.fbc=previous.endsWith('.'+next.fbclid)?previous:'fb.1.'+Date.now()+'.'+next.fbclid;
   document.cookie='_fbc='+next.fbc+'; Path=/; Max-Age=7776000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
  }
  try{localStorage.setItem(storageKey,JSON.stringify(next));}catch{}
 }
 function get(){
  const value=read();
  if(value.observedAt&&Date.now()-value.observedAt>90*86400000)return {fbc:readCookie('_fbc'),fbp:readCookie('_fbp')};
  return {...value,fbc:readCookie('_fbc')||value.fbc,fbp:readCookie('_fbp')};
 }
 function event(name,data,eventId){
  if(typeof window.fbq!=='function')return false;
  window.fbq('track',name,data,eventId?{eventID:eventId}:undefined);return true;
 }
 window.ArenaTracking={get,event};
 document.addEventListener('DOMContentLoaded',()=>event('PageView',{}));
})();
