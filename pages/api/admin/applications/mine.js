// pages/api/admin/applications/mine.js
import { getDb } from '../../../../lib/mongodb';
import cookie from 'cookie';
import { verifyToken } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // Admin-only: return recent applications (for admin dashboard quick view)
  const token = cookie.parse(req.headers.cookie || '').token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let payload;
  try { payload = verifyToken(token); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
  if (payload.role !== 'admin') return res.status(403).json({ error: 'Requires admin' });

  const db = await getDb();

  if (req.method === 'GET') {
    try {
      const { limit = 50, page = 1 } = req.query;
      const lim = Math.min(500, Number(limit) || 50);
      const skip = (Math.max(1, Number(page) || 1) - 1) * lim;

      const cursor = db.collection('applications')
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim);

      const apps = await cursor.toArray();
      const out = apps.map(a => ({
        ...a,
        _id: a._id.toString(),
        jobId: a.jobId ? a.jobId.toString() : null,
        candidateId: a.candidateId ? a.candidateId.toString() : null,
      }));

      return res.json({ applications: out, count: out.length });
    } catch (err) {
      console.error('GET /api/admin/applications/mine error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET');
  res.status(405).end();
}
