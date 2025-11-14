// scripts/init-db.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB');

  // pick DB name from URI or default
  let dbName;
  try {
    const tail = uri.split('/').pop();
    dbName = tail.split('?')[0] || 'jobs_portal';
  } catch (e) {
    dbName = 'jobs_portal';
  }

  const db = client.db(dbName);

  // indexes
  console.log('Ensuring indexes...');
  await db.collection('jobs').createIndex({ published_at: -1 });
  await db.collection('jobs').createIndex({ title: 'text', description: 'text', employer: 'text', field: 'text' });
  await db.collection('candidates').createIndex({ email: 1 }, { unique: true });
  await db.collection('applications').createIndex({ candidateId: 1 });
  await db.collection('applications').createIndex({ jobId: 1 });

  // seed admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
  const existing = await db.collection('admins').findOne({ email: adminEmail });
  if (!existing) {
    const password = process.env.ADMIN_PASSWORD || 'Admin123'; // change in production
    const hashed = await bcrypt.hash(password, 10);
    const r = await db.collection('admins').insertOne({
      name: 'Site Admin',
      email: adminEmail,
      password_hash: hashed,
      role: 'admin',
      createdAt: new Date()
    });
    console.log('Inserted admin:', adminEmail, 'password:', password);
  } else {
    console.log('Admin already exists:', adminEmail);
  }

  // sample jobs
  const sampleJobs = [
    {
      title: 'Gas Detection Technician - SCBA',
      employer: 'Adecco',
      field: 'Engineering',
      pay: '$35 - $45 / Hourly',
      location: 'Fort McMurray, Alberta',
      type: 'Temporary/Contract',
      featured: true,
      description: 'Experienced Gas Detection Technician for oil & gas worksites.',
      published_at: new Date()
    },
    {
      title: 'Material Handler',
      employer: 'Logistics Co',
      field: 'Warehousing',
      pay: '$20.60 / Hourly',
      location: 'Bolton, Ontario',
      type: 'Full-time',
      featured: true,
      description: 'Material handling, forklift experience preferred.',
      published_at: new Date()
    },
    {
      title: 'Technician',
      employer: 'IT Services',
      field: 'Information Technology',
      pay: '$25 - $30 / Hourly',
      location: 'Whitby, Ontario',
      type: 'Part-time',
      featured: false,
      description: 'Support and technician tasks.',
      published_at: new Date()
    }
  ];

  // insert sample jobs if none present
  const jobsCount = await db.collection('jobs').countDocuments();
  if (jobsCount === 0) {
    const r = await db.collection('jobs').insertMany(sampleJobs);
    console.log('Inserted sample jobs:', r.insertedCount);
  } else {
    console.log('Jobs collection not empty, skipping sample insert (count=', jobsCount, ')');
  }

  console.log('Init complete.');
  await client.close();
  process.exit(0);
})();
