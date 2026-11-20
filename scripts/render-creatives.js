'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
async function main(){
 const out=process.argv[2]||path.resolve(__dirname,'../../../output/arena-sport');
 await fs.mkdir(path.join(out,'fonts'),{recursive:true});
 const url='https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;800;900&family=Outfit:wght@600;700&display=swap';
 const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36'}});
 if(!response.ok)throw new Error('Font CSS unavailable');
 let css=await response.text();const urls=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];
 for(let i=0;i<urls.length;i++){
  const r=await fetch(urls[i]);if(!r.ok)throw new Error('Font unavailable');
  const name='font-'+i+'.woff2';await fs.writeFile(path.join(out,'fonts',name),Buffer.from(await r.arrayBuffer()));css=css.split(urls[i]).join(name);
 }
 await fs.writeFile(path.join(out,'fonts/fonts.css'),css);
 const browser=await chromium.launch();
 const exports=[];
 try{
  for(const concept of ['product','football'])for(const ratio of ['feed','vertical','square']){
   const height=ratio==='feed'?1350:ratio==='square'?1080:1920,page=await browser.newPage({viewport:{width:1080,height},deviceScaleFactor:1});
   await page.goto(pathToFileURL(path.join(out,'creative.html')).href+'?concept='+concept+'&ratio='+ratio);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
   const checks=await page.evaluate(()=>({arabicFont:document.fonts.check('800 84px Cairo'),overflow:document.documentElement.scrollWidth>1080,
    texts:[...document.querySelectorAll('.hook,.body,.cta,.trust')].map(e=>({text:e.textContent,width:e.getBoundingClientRect().width,scroll:e.scrollWidth}))}));
   if(!checks.arabicFont||checks.overflow||checks.texts.some(t=>t.scroll>t.width+1))throw new Error('Typography overflow: '+JSON.stringify(checks));
   const name='arena-'+concept+'-v1-'+('1080x'+height)+'.png';
   await page.locator('#scene').screenshot({path:path.join(out,name)});
   exports.push({name,width:1080,height,checks});await page.close();
  }
 }finally{await browser.close();}
 await fs.writeFile(path.join(out,'render-verification.json'),JSON.stringify(exports,null,2));
 const target=path.resolve(__dirname,'../assets/banners/arena-sport');await fs.mkdir(target,{recursive:true});
 for(const entry of exports)await fs.copyFile(path.join(out,entry.name),path.join(target,entry.name));
 console.log(JSON.stringify(exports.map(({name,width,height})=>({name,width,height}))));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
