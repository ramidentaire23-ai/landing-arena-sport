'use strict';
const fs = require('node:fs');
const path = require('node:path');
let connection;
function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  if (!connection) {
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    connection = {
      query: (text, values = []) => sql.query(text, values),
      transaction: statements => sql.transaction(statements.map(s => sql.query(s.text, s.values || [])))
    };
  }
  return connection;
}
async function migrate(db = getDatabase()) {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.transaction(schema.split(';').map(text => text.trim()).filter(Boolean).map(text => ({text})));
}
module.exports = { getDatabase, migrate };
