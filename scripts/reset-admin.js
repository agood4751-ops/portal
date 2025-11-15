// scripts/reset-admin.js
// Usage: node scripts/reset-admin.js
// This script deletes all users with role 'admin' and inserts a single admin user.
// IMPORTANT: change the password after you log in on production.

require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: set MONGODB_URI in .env.local');
  process.exit(1);
}

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Admin123'; // change after logging in!

async function run() {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();

    // Determine DB name from URI or default to the last path segment
    let dbName = client.s.options.dbName;
    if (!dbName) {
      // try to parse from connection string
      const m = MONGODB_URI.match(/\/([^/?]+)(\?|$)/);
      dbName = (m && m[1]) ? m[1] : 'test';
    }
    const db = client.db(dbName);
    const users = db.collection('users');

    console.log('Deleting existing admin users (role === "admin")...');
    const delRes = await users.deleteMany({ role: 'admin' });
    console.log(`Deleted ${delRes.deletedCount} admin user(s).`);

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    const adminDoc = {
      // create a deterministic-ish _id to make debugging easier (optional)
      createdAt: new Date(),
      email: ADMIN_EMAIL,
      name: 'Admin',
      phone: '',
      role: 'admin',
      passwordHash,         // store the salted hash
      // any other fields your app expects:
      createdByScript: true
    };

    const insertRes = await users.insertOne(adminDoc);
    console.log('Inserted admin user:', { insertedId: insertRes.insertedId.toString(), email: ADMIN_EMAIL });
    console.log('You can now log in with:', ADMIN_EMAIL, '/', ADMIN_PASSWORD);
    console.log('IMPORTANT: Change this password immediately after login.');

    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err);
    try { await client.close(); } catch(e){}
    process.exit(1);
  }
}

run();
