require('dotenv').config({path:'.env.local',quiet:true});
require('../server/db').migrate().then(()=>console.log('Order ledger schema ready')).catch(()=>{console.error('Migration failed; verify DATABASE_URL and database permissions.');process.exitCode=1;});
