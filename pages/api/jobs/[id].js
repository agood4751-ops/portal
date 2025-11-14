// pages/api/jobs/[id].js
import { getDb } from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';
import { ObjectId } from 'mongodb';


export default async function handler(req, res) {
  const db = await getDb();
  const { id } = req.query;

  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

  if (req.method === 'GET') {
    const job = await db.collection('jobs').findOne({ _id: new ObjectId(id) });
    if (!job) return res.status(404).json({ error: 'Not found' });
    return res.json({ job: { ...job, _id: job._id.toString() } });
  }

  // For modifying jobs (admin) - simple admin check via token
  const token = cookie.parse(req.headers.cookie || '').token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let payload;
  try { payload = verifyToken(token); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
  if (payload.role !== 'admin') return res.status(403).json({ error: 'Requires admin' });

  if (req.method === 'PUT') {
    const updates = req.body || {};
    await db.collection('jobs').updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    await db.collection('jobs').deleteOne({ _id: new ObjectId(id) });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
