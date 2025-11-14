// lib/mongodb.js
import { MongoClient, GridFSBucket } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please set MONGODB_URI in .env.local');
}

let cachedClient = global._mongoClient;
let cachedDb = global._mongoDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const dbName = (() => {
    // try to read database from URI path, fallback to 'jobs_portal'
    try {
      const parsed = uri.split('/').pop().split('?')[0];
      return parsed || 'jobs_portal';
    } catch (e) {
      return 'jobs_portal';
    }
  })();
  const db = client.db(dbName);
  cachedClient = global._mongoClient = client;
  cachedDb = global._mongoDb = db;
  return { client, db };
}

export async function getDb() {
  const r = await connectToDatabase();
  return r.db;
}

export async function getGridFSBucket() {
  const { client, db } = await connectToDatabase();
  // default bucket name 'fs' used by mongodb driver -> fs.files/fs.chunks
  return new GridFSBucket(db, { bucketName: 'fs' });
}
