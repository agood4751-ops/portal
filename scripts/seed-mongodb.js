// scripts/seed-mongodb.js
/**
 * Seed script for MongoDB Atlas.
 * Usage: MONGODB_URI="..." node scripts/seed-mongodb.js
 *
 * It will:
 *  - create an 'admins' user with email: admin@yourdomain.com (password: Admin123)
 *  - insert several sample job documents
 */

require('dotenv').config({ path: '.env.local' });


const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Please set MONGODB_URI env var');
  process.exit(1);
}

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();

    // Admin user
    const adminEmail = 'admin@yourdomain.com';
    const adminPassword = 'Admin123'; // change after seed
    const existingAdmin = await db.collection('admins').findOne({ email: adminEmail });
    if (!existingAdmin) {
      const password_hash = await bcrypt.hash(adminPassword, 10);
      await db.collection('admins').insertOne({ email: adminEmail, name: 'Site Admin', password_hash, createdAt: new Date() });
      console.log(`Inserted admin: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('Admin already exists:', adminEmail);
    }

    // Sample jobs
    const sampleJobs = [
      {
        title: 'Gas Detection Technician - SCBA',
        employer: 'Adecco',
        field: 'Engineering',
        pay: '$35 - $45 / Hourly',
        location: 'Fort McMurray, Alberta',
        city: 'Fort McMurray',
        postal_or_zip: 'T9H',
        type: 'Temporary/Contract',
        featured: true,
        description: 'Experienced Gas Detection Technician skilled with SCBA.',
        published_at: new Date(Date.now() - 24*60*60*1000)
      },
      {
        title: 'Power Equipment Operator',
        employer: 'Industrial Ops Ltd.',
        field: 'Warehousing',
        pay: '$20.60 / Hourly',
        location: 'Bolton, Ontario',
        city: 'Bolton',
        postal_or_zip: 'L7E',
        type: 'Full-time',
        featured: true,
        description: 'Operate heavy power equipment in warehouse settings.',
        published_at: new Date(Date.now() - 24*60*60*1000)
      },
      {
        title: 'Material Handler',
        employer: 'LogiCorp',
        field: 'Warehousing',
        pay: '',
        location: 'Brockville, Ontario',
        city: 'Brockville',
        postal_or_zip: 'K6V',
        type: 'Part-time',
        featured: false,
        description: 'Material handling and shipping/receiving duties.',
        published_at: new Date()
      },
      {
        title: 'Junior Software Developer',
        employer: 'MapleTech',
        field: 'Information Technology',
        pay: '$50,000 - $75,000 / Year',
        location: 'Toronto, Ontario',
        city: 'Toronto',
        postal_or_zip: 'M5V',
        type: 'Full-time',
        featured: true,
        description: 'Entry-level developer with knowledge of JavaScript/Node/React.',
        published_at: new Date()
      }
    ];

    const inserted = await db.collection('jobs').insertMany(sampleJobs);
    console.log('Inserted sample jobs:', Object.keys(inserted.insertedIds).length);

    console.log('Seed complete.');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await client.close();
  }
})();
