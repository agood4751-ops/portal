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

  // only candidates allowed here (admins could use admin endpoints)
  if (payload.role !== 'candidate') {
    // allow admins to inspect their own view optionally
    // return res.status(403).json({ error: 'Requires candidate role' });
  }

  const db = await getDb();

  if (req.method === 'GET') {
    try {
      const apps = await db.collection('applications')
        .find({ candidateId: new ObjectId(payload.sub) })
        .sort({ createdAt: -1 })
        .toArray();

      const out = apps.map(a => ({
        ...a,
        _id: a._id.toString(),
        jobId: a.jobId ? a.jobId.toString() : null,
        candidateId: a.candidateId ? a.candidateId.toString() : null,
      }));

      return res.json({ applications: out });
    } catch (err) {
      console.error('GET /api/applications/mine error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET');
  res.status(405).end();
}
