(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 let products=[],wilayas=[],variantId='black_red',slide=0,wilayaId=null,deliveryType=null,submitting=false,ready=false,checkoutStarted=false;
 const quantity=1;
 const status=document.createElement('p');status.id='orderStatus';status.setAttribute('role','alert');status.setAttribute('aria-live','polite');status.className='order-status';
 const retry=document.createElement('button');retry.type='button';retry.textContent='إعادة تحميل خيارات التوصيل';retry.hidden=true;
 const variant=()=>products.find(p=>p.id===variantId);
 const wilaya=()=>wilayas.find(w=>w.id===wilayaId);
 function message(text){status.textContent=text;}
 function storageRead(key){try{return JSON.parse(sessionStorage.getItem(key)||'null');}catch{return null;}}
 function storageWrite(key,value){sessionStorage.setItem(key,JSON.stringify(value));}
 function options(select,placeholder,items){
  select.replaceChildren(new Option(placeholder,''));
  items.forEach(item=>select.add(new Option(item.label,item.value)));
 }
 function updateGallery(){
  const p=variant();if(!p)return;slide=(slide+p.photos.length)%p.photos.length;
  $('gallerySlideImg').src=p.photos[slide];$('gallerySlideImg').alt='إطار Arena Sport '+p.name_ar;
  $('slideCounter').textContent=(slide+1)+' / '+p.photos.length;
  $('galleryDotsContainer').replaceChildren(...p.photos.map((_,i)=>{const b=document.createElement('button');b.type='button';b.className='gallery-dot'+(slide===i?' active':'');b.setAttribute('aria-label','الصورة '+(i+1));b.addEventListener('click',()=>{slide=i;updateGallery();});return b;}));
 }
 function viewProduct(){
  const p=variant();if(p)window.ArenaTracking?.event('ViewContent',{currency:'DZD',value:2900,content_type:'product',content_ids:[p.catalogId],contents:[{id:p.catalogId,quantity:1,item_price:2900}]});
 }
 function selectVariant(id){
  if(!products.some(p=>p.id===id))return;
  variantId=id;slide=0;
  document.querySelectorAll('.variant-option-btn').forEach(b=>{const selected=b.dataset.variant===id;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
  $('selectedVariantInput').value=id;
  $('recapVariantName').textContent='الموديل المختار: '+variant().name_ar;
  updateGallery();viewProduct();
 }
 function renderTotals(){
  const w=wilaya(),fee=deliveryType&&w?(deliveryType==='desk'?w.deskFee:w.homeFee):null;
  $('recapProductPrice').textContent='2,900 دج';
  $('recapShippingFee').textContent=Number.isFinite(fee)?fee+' دج':'اختار الولاية وطريقة التوصيل';
  const total=Number.isFinite(fee)?(2900+fee)+' دج':'2,900 دج + التوصيل';
  $('recapTotalAmount').textContent=total;$('stickyTotalAmount').textContent=total;
  $('deskPriceDisplay').textContent=Number.isFinite(w?.deskFee)?w.deskFee+' دج':'—';
  $('homePriceDisplay').textContent=Number.isFinite(w?.homeFee)?w.homeFee+' دج':'—';
 }
 function renderDelivery(){
  const w=wilaya();
  $('deliveryDeskCard').classList.toggle('active',deliveryType==='desk');
  $('deliveryHomeCard').classList.toggle('active',deliveryType==='home');
  for(const [id,enabled]of [['deliveryDeskCard',!!w?.desks.length&&Number.isFinite(w?.deskFee)],['deliveryHomeCard',!!w?.communes.length&&Number.isFinite(w?.homeFee)]]){
   $(id).setAttribute('aria-disabled',String(!enabled));$(id).setAttribute('aria-pressed',String(id==='deliveryDeskCard'?deliveryType==='desk':deliveryType==='home'));
  }
  $('communeContainer').style.display=deliveryType==='home'?'block':'none';
  $('addressContainer').style.display=deliveryType==='home'?'block':'none';
  $('stopdeskStationContainer').style.display=deliveryType==='desk'?'block':'none';
  $('stopdeskNotice').classList.toggle('visible',deliveryType==='desk');
  $('communeSelect').required=deliveryType==='home';$('clientAddressInput').required=deliveryType==='home';$('stationSelect').required=deliveryType==='desk';
  $('recapShippingLabel').textContent=deliveryType==='desk'?'تكلفة التوصيل للمكتب:':'تكلفة التوصيل:';
  const desk=w?.desks.find(d=>d.code===$('stationSelect').value);
  $('stopdeskSelectedAddress').textContent=desk?desk.name+' — '+desk.address:'اختار مكتب الاستلام';
  renderTotals();
 }
 function chooseDelivery(type){
  const w=wilaya();if(!w){message('اختار الولاية أولاً.');return;}
  if(type==='desk'&&(!w.desks.length||!Number.isFinite(w.deskFee)))return;
  if(type==='home'&&(!w.communes.length||!Number.isFinite(w.homeFee)))return;
  deliveryType=type;message('');renderDelivery();startCheckout();
 }
 function startCheckout(){
  if(checkoutStarted||!variant())return;
  checkoutStarted=true;window.ArenaTracking?.event('InitiateCheckout',{currency:'DZD',value:2900,content_type:'product',content_ids:[variant().catalogId],num_items:1});
 }
 async function load(){
  $('orderSubmitBtn').disabled=true;retry.hidden=true;
  try{
   const productResponse=await fetch('/api/products');if(!productResponse.ok)throw new Error();
   const catalog=await productResponse.json();products=catalog.variants;if(!products.length)throw new Error();
   const requested=new URLSearchParams(location.search).get('variant');
   selectVariant(products.some(p=>p.id===requested)?requested:variantId);
   const deliveryResponse=await fetch('/api/delivery');if(!deliveryResponse.ok)throw new Error();
   const delivery=await deliveryResponse.json();wilayas=delivery.wilayas;if(!wilayas.length)throw new Error();
   options($('wilayaSelect'),'اختار الولاية',wilayas.map(w=>({value:w.id,label:String(w.id).padStart(2,'0')+' — '+w.name})));
   ready=true;$('orderSubmitBtn').disabled=false;message('');renderDelivery();
  }catch{ready=false;message('تعذر تحميل خيارات التوصيل. معلوماتك تبقى محفوظة في الخانات، حاول مرة أخرى.');retry.hidden=false;}
 }
 function normalizePhone(s){
  s=s.replace(/[\s().-]/g,'');
  if(s.startsWith('00213'))s='0'+s.slice(5);else if(s.startsWith('+213'))s='0'+s.slice(4);else if(/^213[567]/.test(s))s='0'+s.slice(3);
  return /^0[567]\d{8}$/.test(s)?s:null;
 }
 function showAccepted(result,draft){
  storageWrite('arena_order_receipt',{orderId:result.orderId,receiptToken:draft.receiptToken});
  sessionStorage.removeItem('arena_order_attempt');
  location.assign('/merci?order_id='+encodeURIComponent(result.orderId));
 }
 async function submit(){
  if(submitting||!ready)return;
  const phone=normalizePhone($('clientPhoneInput').value);
  if(!phone){message('أدخل رقم هاتف جزائري صحيح يبدأ بـ 05 أو 06 أو 07.');$('clientPhoneInput').focus();return;}
  if(!deliveryType){message('اختار طريقة التوصيل: المنزل أو المكتب.');return;}
  if(!$('orderForm').reportValidity())return;
  const input={clientName:$('clientNameInput').value.trim(),phone,variantId,quantity,wilayaId,deliveryType,
   stationCode:deliveryType==='desk'?$('stationSelect').value:'',communeZip:deliveryType==='home'?$('communeSelect').value:'',
   address:deliveryType==='home'?$('clientAddressInput').value.trim():''};
  if(input.clientName.length<3){message('أدخل الاسم واللقب.');return;}
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(input)));
  const fingerprint=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  let draft=storageRead('arena_order_attempt');
  submitting=true;$('orderSubmitBtn').disabled=true;
  try{
   if(draft&&draft.fingerprint!==fingerprint){
    const check=await fetch('/api/orders/receipt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:draft.idempotencyKey,receiptToken:draft.receiptToken})});
    const old=await check.json();
    if(old.status==='accepted'){showAccepted(old,draft);return;}
    if(check.status===404||old.status==='rejected'){draft=null;sessionStorage.removeItem('arena_order_attempt');}
    else{message('طلبك السابق ما زال قيد التحقق. انتظر التأكيد قبل إنشاء طلب آخر.');return;}
   }
   if(!draft){
    const token=btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    draft={idempotencyKey:crypto.randomUUID(),receiptToken:token,fingerprint};storageWrite('arena_order_attempt',draft);
   }
   message('جارٍ تسجيل طلبك…');
   const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({...input,idempotencyKey:draft.idempotencyKey,receiptToken:draft.receiptToken,eventSourceUrl:location.href,attribution:window.ArenaTracking?.get()||{}})});
   const result=await res.json();
   if(res.ok&&result.status==='accepted'){showAccepted(result,draft);return;}
   if(result.status==='pending'||result.status==='creating'){message('استقبلنا طلبك وهو قيد التحقق. اضغط مجدداً بنفس المعلومات للتحقق من حالته. المرجع: '+result.reference);return;}
   if(res.status===422){sessionStorage.removeItem('arena_order_attempt');message('لم يتم تسجيل الطلب. راجع معلوماتك وخيارات التوصيل ثم حاول مجدداً.');return;}
   message('تعذر التحقق من حالة الطلب. حاول مجدداً بنفس المعلومات.');
  }catch{message('تعذر التحقق من حالة الطلب بسبب الاتصال. حاول مجدداً بنفس المعلومات.');}
  finally{submitting=false;$('orderSubmitBtn').disabled=false;}
 }
 document.addEventListener('DOMContentLoaded',()=>{
  $('orderForm').append(status,retry);retry.addEventListener('click',load);
  $('clientNameInput').minLength=3;$('clientPhoneInput').maxLength=22;$('clientAddressInput').minLength=5;
  $('orderForm').addEventListener('input',e=>{if(e.isTrusted&&e.target.value.trim())startCheckout();});
  $('orderForm').addEventListener('submit',e=>{e.preventDefault();submit();});
  document.querySelectorAll('.variant-option-btn').forEach(b=>b.addEventListener('click',()=>selectVariant(b.dataset.variant)));
  $('btnPrevSlide').addEventListener('click',()=>{slide--;updateGallery();});$('btnNextSlide').addEventListener('click',()=>{slide++;updateGallery();});
  let touch; $('galleryStage').addEventListener('touchstart',e=>touch=e.changedTouches[0].screenX,{passive:true});
  $('galleryStage').addEventListener('touchend',e=>{const d=e.changedTouches[0].screenX-touch;if(Math.abs(d)>40){slide+=d<0?1:-1;updateGallery();}},{passive:true});
  $('wilayaSelect').addEventListener('change',()=>{
   wilayaId=Number($('wilayaSelect').value)||null;deliveryType=null;const w=wilaya();
   options($('communeSelect'),'اختار البلدية',(w?.communes||[]).map(c=>({value:c.zip,label:c.name})));
   options($('stationSelect'),'اختار مكتب الاستلام',(w?.desks||[]).map(d=>({value:d.code,label:d.name})));
   renderDelivery();startCheckout();
  });
  for(const [id,type]of [['deliveryDeskCard','desk'],['deliveryHomeCard','home']]){
   $(id).setAttribute('role','button');$(id).tabIndex=0;$(id).addEventListener('click',()=>chooseDelivery(type));
   $(id).addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();chooseDelivery(type);}});
  }
  $('stationSelect').addEventListener('change',renderDelivery);
  document.querySelectorAll('.faq-item .faq-header').forEach(h=>h.addEventListener('click',()=>h.closest('.faq-item').classList.toggle('open')));
  load();
 });
})();
