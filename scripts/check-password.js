// scripts/check-password.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

(async () => {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const u = await db.collection('users').findOne({ email: 'admin@admin.com' });
  console.log('found user:', !!u);
  if (u) {
    const hash = u.passwordHash || u.password;
    console.log('hash field present:', !!hash);
    const ok = await bcrypt.compare('Admin123', hash);
    console.log('password matches Admin123?', ok);
  }
  await client.close();
  process.exit(0);
})();
