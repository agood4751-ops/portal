// scripts/list-applications.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Set MONGODB_URI in .env.local');
    process.exit(1);
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const dbName = uri.split('/').pop().split('?')[0] || 'jobs_portal';
  const db = client.db(dbName);
  const apps = await db.collection('applications').find().sort({ createdAt: -1 }).limit(20).toArray();
  console.log('Latest applications:', apps.map(a => ({ id: a._id.toString(), jobTitle: a.jobTitle, name: a.name, email: a.email, status: a.status, createdAt: a.createdAt })));
  await client.close();
  process.exit(0);
})();
