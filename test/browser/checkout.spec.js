const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{window.__events=[];window.fbq=(...args)=>window.__events.push(args);});
 await page.route('https://connect.facebook.net/**',route=>route.abort());
});
async function fill(page,name='Test Arena'){
 await page.locator('#clientNameInput').fill(name);await page.locator('#clientPhoneInput').fill('+213 660 000 001');
 await page.locator('#wilayaSelect').selectOption('16');await page.locator('#deliveryDeskCard').click();await page.locator('#stationSelect').selectOption('16A');
}
test('four age-specific models, intentional region, one verified browser Purchase with server event ID',async({page})=>{
 await page.goto('/?fbclid=REAL_CLICK&ad_id=123456789&variant=kids_black');
 await expect(page.locator('#orderSubmitBtn')).toBeEnabled();
 await expect(page.locator('.variant-option-btn')).toHaveCount(4);await expect(page.locator('#wilayaSelect')).toHaveValue('');
 await expect(page.locator('[data-variant=kids_black]')).toHaveClass(/selected/);
 await fill(page);
 let api;await page.route('**/api/orders',async route=>{const response=await route.fetch();api=await response.json();await route.fulfill({response});});
 await page.locator('#orderSubmitBtn').click();
 await expect(page).toHaveURL(/\/merci\?order_id=/);await expect(page.locator('.thankyou-title')).toHaveText('تم تسجيل طلبك بنجاح');
 const purchase=await page.evaluate(()=>window.__events.filter(e=>e[1]==='Purchase'));
 expect(purchase).toHaveLength(1);expect(purchase[0][3].eventID).toBe(api.eventId);expect(purchase[0][2].value).toBe(2900);
 expect(purchase[0][2].content_ids).toEqual(['y8eweapeo0']);
 await page.reload();await expect(page.locator('.thankyou-title')).toHaveText('تم تسجيل طلبك بنجاح');
 expect(await page.evaluate(()=>window.__events.filter(e=>e[1]==='Purchase'))).toHaveLength(0);
});
test('carrier rejection preserves the form and produces no Purchase',async({page})=>{
 await page.goto('/');await expect(page.locator('#orderSubmitBtn')).toBeEnabled();await fill(page,'Reject Test');
 await page.locator('#orderSubmitBtn').click();await expect(page.locator('#orderStatus')).toContainText('لم يتم تسجيل الطلب');
 expect(await page.evaluate(()=>window.__events.filter(e=>e[1]==='Purchase'))).toHaveLength(0);
 await expect(page.locator('#clientNameInput')).toHaveValue('Reject Test');await expect(page).not.toHaveURL(/merci/);
});
test('uncertain result stays on form; a repeated click reuses the existing request',async({page})=>{
 await page.goto('/');await expect(page.locator('#orderSubmitBtn')).toBeEnabled();await fill(page,'Pending Test');
 const keys=[];page.on('request',r=>{if(r.url().endsWith('/api/orders')&&r.method()==='POST')keys.push(r.postDataJSON().idempotencyKey);});
 await page.locator('#orderSubmitBtn').click();await expect(page.locator('#orderStatus')).toContainText('قيد التحقق');
 await page.locator('#orderSubmitBtn').click();await expect(page.locator('#orderStatus')).toContainText('قيد التحقق');
 expect(keys).toHaveLength(2);expect(keys[0]).toBe(keys[1]);await expect(page).not.toHaveURL(/merci/);
});
test('direct thank-you visit has no Purchase or fabricated order',async({page})=>{
 await page.goto('/merci?order_id=ARENA-12345');await expect(page.locator('.thankyou-title')).toHaveText('لا يوجد طلب مؤكد للعرض');
 expect(await page.evaluate(()=>window.__events.filter(e=>e[1]==='Purchase'))).toHaveLength(0);await expect(page.locator('.order-summary-box')).toBeHidden();
});
test('mobile page keeps price and CTA readable without horizontal overflow',async({page})=>{
 await page.goto('/');await expect(page.locator('#orderSubmitBtn')).toBeEnabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.product-intro h1')).toBeInViewport();await expect(page.locator('.intro-offer a')).toBeInViewport();
 await page.screenshot({path:'../../output/arena-sport/landing-mobile.png',fullPage:true});
});

test('transparent age groups keep different photos, accessories and purchase catalog IDs',async({page})=>{
 await page.goto('/?variant=transparent');await expect(page.locator('#orderSubmitBtn')).toBeEnabled();
 await expect(page.locator('.variant-age-group')).toHaveCount(2);
 await expect(page.locator('[data-age-group="12_plus"] .variant-option-btn')).toHaveCount(2);
 await expect(page.locator('[data-age-group="kids_5_11"] .variant-option-btn')).toHaveCount(2);
 await expect(page.locator('#selectedModelDetails')).toContainText('12 سنة فما فوق');
 await expect(page.locator('#selectedModelDetails')).toContainText('أذرع ورباط');
 await expect(page.locator('#gallerySlideImg')).toHaveAttribute('src','assets/images/transparent-1.jpg');
 await page.locator('[data-variant=kids_transparent]').click();
 await expect(page.locator('#selectedModelDetails')).toContainText('من 5 إلى 11 سنة');
 await expect(page.locator('#selectedModelDetails')).toContainText('بدون أذرع');
 await expect(page.locator('#gallerySlideImg')).toHaveAttribute('src','assets/images/kids-transparent-1.jpg');
 await expect(page.locator('#recapVariantName')).toContainText('شفاف للأطفال');
 await fill(page);await page.locator('#orderSubmitBtn').click();await expect(page).toHaveURL(/\/merci\?order_id=/);await expect(page.locator('.thankyou-title')).toHaveText('تم تسجيل طلبك بنجاح');
 const purchase=await page.evaluate(()=>window.__events.filter(e=>e[1]==='Purchase'));expect(purchase).toHaveLength(1);
 expect(purchase[0][2].content_ids).toEqual(['cb1ztgr1vc']);expect(purchase[0][2].value).toBe(2900);
});
