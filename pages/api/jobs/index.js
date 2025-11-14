// pages/api/jobs/index.js
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const db = await getDb();

  if (req.method === 'GET') {
    const { title = '', location = '' } = req.query;
    const q = {};
    if (title) q.$or = [{ title: { $regex: title, $options: 'i' } }, { field: { $regex: title, $options: 'i' } }];
    if (location) q.$or = [...(q.$or || []), { location: { $regex: location, $options: 'i' } }, { city: { $regex: location, $options: 'i' } }, { postal_or_zip: { $regex: location, $options: 'i' } }];
    const jobs = await db.collection('jobs').find(q).sort({ published_at: -1 }).limit(200).toArray();
    // convert ObjectId to string for _id (optional but helpful)
    const jobsSafe = jobs.map(j => ({ ...j, _id: j._id.toString() }));
    return res.json({ jobs: jobsSafe });
  }

  if (req.method === 'POST') {
    // NOTE: Add admin authentication in production
    const job = req.body;
    job.published_at = new Date();
    const r = await db.collection('jobs').insertOne(job);
    return res.status(201).json({ id: r.insertedId.toString() });
  }

  res.status(405).end();
}
