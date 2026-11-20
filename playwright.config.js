const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'test/browser',workers:1,use:{baseURL:'http://127.0.0.1:3100',viewport:{width:390,height:844}},
 webServer:{command:'node test/fixture-server.js',url:'http://127.0.0.1:3100/api/products',reuseExistingServer:false,timeout:60000},
 reporter:'list'
});
