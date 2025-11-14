// pages/api/applications/mine.js
import { getDb } from '../../../lib/mongodb';
import cookie from 'cookie';
import { verifyToken } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = cookie.parse(req.headers.cookie || '').token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  let payload;
  try { payload = verifyToken(token); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }

  const db = await getDb();
  const apps = await db.collection('applications').find({ candidateId: new ObjectId(payload.sub) }).sort({ createdAt: -1 }).toArray();

  // map to safe output
  const out = apps.map(a => ({
    ...a,
    _id: a._id.toString(),
    jobId: a.jobId?.toString?.(),
    createdAt: a.createdAt
  }));

  res.json({ applications: out });
}
