'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),out=path.join(root,'public');
fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','merci.html'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
console.log('Public allowlist built: pages and assets only.');
