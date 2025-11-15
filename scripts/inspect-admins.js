// scripts/inspect-admins.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Set MONGODB_URI in .env.local');
    process.exit(1);
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    // derive db name from connection string if possible
    const m = uri.match(/\/([^/?]+)(\?|$)/);
    const dbName = m && m[1] ? m[1] : undefined;
    const db = dbName ? client.db(dbName) : client.db();
    const users = db.collection('users');
    const admins = await users.find({ role: 'admin' }).toArray();
    console.log('Admin users found:', admins.length);
    admins.forEach(u => {
      console.log({
        _id: u._id ? u._id.toString() : '(no id)',
        email: u.email,
        role: u.role,
        passwordHashExists: !!(u.passwordHash || u.password),
        passwordField: u.passwordHash ? 'passwordHash' : (u.password ? 'password' : '(none)'),
        createdAt: u.createdAt,
        createdByScript: u.createdByScript || false,
      });
    });
  } catch (e) {
    console.error('ERR', e);
  } finally {
    await client.close();
    process.exit(0);
  }
})();
