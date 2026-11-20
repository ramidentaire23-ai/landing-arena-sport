(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 document.addEventListener('DOMContentLoaded',async()=>{
  const title=document.querySelector('.thankyou-title'),subtitle=document.querySelector('.thankyou-subtitle'),box=document.querySelector('.order-summary-box'),contact=$('whatsappBtn');
  title.textContent='جارٍ التحقق من طلبك…';subtitle.textContent='';box.hidden=true;contact.hidden=true;contact.style.display='none';
  let saved;try{saved=JSON.parse(sessionStorage.getItem('arena_order_receipt')||'null');}catch{}
  const id=new URLSearchParams(location.search).get('order_id');
  if(!saved||saved.orderId!==id){title.textContent='لا يوجد طلب مؤكد للعرض';subtitle.textContent='ارجع للموقع لإرسال طلبك أو للتحقق من حالته.';return;}
  try{
   const res=await fetch('/api/orders/receipt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(saved)});
   const receipt=await res.json();
   if(!res.ok||receipt.status!=='accepted'){title.textContent='الطلب قيد التحقق';subtitle.textContent='لم نتمكن بعد من تأكيد تسجيل الطلب. لا تنشئ طلباً آخر قبل التحقق.';return;}
   const o=receipt.order;title.textContent='تم تسجيل طلبك بنجاح';subtitle.textContent='سنتصل بك هاتفياً لتأكيد المعلومات قبل إرسال الطلب.';
   box.hidden=false;$('orderRefDisplay').textContent=receipt.reference;$('summaryClientName').textContent=o.clientName;$('summaryPhone').textContent=o.phone;
   $('summaryVariant').textContent=o.variant.name_ar;$('summaryLocation').textContent=o.commune+' — '+o.wilayaName;
   $('summaryDeliveryType').textContent=o.deliveryType==='desk'?'الاستلام من مكتب NOEST':'التوصيل للمنزل';$('summaryTotal').textContent=o.total+' دج';
   contact.href='https://wa.me/213663407015?text='+encodeURIComponent('مرحباً Arena Sport، استفسار بخصوص الطلب '+receipt.reference);
   contact.style.display='flex';contact.hidden=false;contact.querySelector('span').textContent='استفسار حول الطلب عبر واتساب';
   const key='arena_purchase_fired_'+receipt.orderId;
   let fired=false;try{fired=!!localStorage.getItem(key);}catch{}
   if(receipt.browserPurchaseEligible&&!fired&&window.ArenaTracking?.event('Purchase',receipt.purchase,receipt.eventId)){
    try{localStorage.setItem(key,String(Date.now()));}catch{}
   }
  }catch{title.textContent='تعذر التحقق من الطلب الآن';subtitle.textContent='حاول تحديث الصفحة لاحقاً. لا تنشئ طلباً آخر قبل التحقق.';}
 });
})();
