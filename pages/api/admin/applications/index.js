// pages/api/admin/applications/index.js
import { getDb } from '../../../../lib/mongodb';
import cookie from 'cookie';
import { verifyToken } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = cookie.parse(req.headers.cookie || '').token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  let payload;
  try { payload = verifyToken(token); } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
  if (payload.role !== 'admin') return res.status(403).json({ error: 'Requires admin' });

  const db = await getDb();

  if (req.method === 'GET') {
    try {
      const { status, q, recent, limit = 50, page = 1 } = req.query;
      const filt = {};

      if (status) filt.status = status;
      if (q) {
        filt.$or = [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { jobTitle: { $regex: q, $options: 'i' } },
        ];
      }

      const opts = { sort: { createdAt: -1 } };
      const lim = Math.min(500, Number(limit) || 50);
      const skip = (Math.max(1, Number(page) || 1) - 1) * lim;

      let cursor = db.collection('applications').find(filt, opts).skip(skip).limit(lim);
      const apps = await cursor.toArray();

      const out = apps.map(a => ({
        ...a,
        _id: a._id.toString(),
        jobId: a.jobId ? a.jobId.toString() : null,
        candidateId: a.candidateId ? a.candidateId.toString() : null,
      }));

      return res.json({ applications: out });
    } catch (err) {
      console.error('GET /api/admin/applications error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // support POST to create a server-side note or bulk actions (optional)
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      // example: bulk update status for list of ids { ids: [id1,id2], status: 'Shortlist' }
      if (Array.isArray(body.ids) && body.status) {
        const objectIds = body.ids.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));
        if (objectIds.length === 0) return res.status(400).json({ error: 'No valid ids' });
        await db.collection('applications').updateMany({ _id: { $in: objectIds } }, { $set: { status: body.status } });
        return res.json({ ok: true, updated: objectIds.length });
      }
      return res.status(400).json({ error: 'Unsupported action' });
    } catch (err) {
      console.error('POST /api/admin/applications error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end();
}
