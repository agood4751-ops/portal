// pages/api/admin/jobs/index.js
import { getDb } from '../../../../lib/mongodb';
import cookie from 'cookie';
import { verifyToken } from '../../../../lib/auth';

export default async function handler(req, res) {
  const token = cookie.parse(req.headers.cookie || '').token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let payload;
  try { payload = verifyToken(token); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
  if (payload.role !== 'admin') return res.status(403).json({ error: 'Requires admin' });

  const db = await getDb();

  // List jobs
  if (req.method === 'GET') {
    try {
      const { q, limit = 200, page = 1 } = req.query;
      const filt = {};
      if (q) {
        filt.$or = [
          { title: { $regex: q, $options: 'i' } },
          { employer: { $regex: q, $options: 'i' } },
          { field: { $regex: q, $options: 'i' } }
        ];
      }
      const lim = Math.min(1000, Number(limit) || 200);
      const skip = (Math.max(1, Number(page) || 1) - 1) * lim;

      const cursor = db.collection('jobs').find(filt).sort({ createdAt: -1 }).skip(skip).limit(lim);
      const docs = await cursor.toArray();
      const jobs = docs.map(d => ({ ...d, _id: d._id.toString() }));
      return res.json({ jobs });
    } catch (err) {
      console.error('GET /api/admin/jobs error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create job
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const now = new Date();
      const doc = {
        title: String(body.title || '').trim(),
        employer: String(body.employer || '').trim(),
        field: String(body.field || '').trim(),
        salary: body.salary || '',
        type: body.type || '',
        location: body.location || '',
        description: body.description || '',
        featured: !!body.featured,
        createdAt: now,
        updatedAt: now,
        postedBy: payload.sub
      };
      if (!doc.title) return res.status(400).json({ error: 'Missing title' });

      const r = await db.collection('jobs').insertOne(doc);
      return res.status(201).json({ ok: true, id: r.insertedId.toString() });
    } catch (err) {
      console.error('POST /api/admin/jobs error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end();
}
