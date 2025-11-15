// pages/api/admin/candidates/[id].js
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
  const { id } = req.query;
  if (!id || !ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  const oid = new ObjectId(id);

  // GET: candidate profile + files + applications
  if (req.method === 'GET') {
    try {
      const cand = await db.collection('candidates').findOne({ _id: oid });
      if (!cand) return res.status(404).json({ error: 'Not found' });

      // find applications by candidate id
      const apps = await db.collection('applications').find({ candidateId: id }).sort({ createdAt: -1 }).toArray();

      // format
      const out = {
        candidate: { ...cand, _id: cand._id.toString() },
        applications: apps.map(a => ({
          ...a,
          _id: a._id.toString(),
          jobId: a.jobId ? a.jobId.toString() : null,
        }))
      };
      return res.json(out);
    } catch (err) {
      console.error('GET /api/admin/candidates/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT: update candidate fields (name, phone, notes, etc)
  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const updates = {};
      ['name','email','phone','notes','address'].forEach(k => { if (typeof body[k] !== 'undefined') updates[k] = body[k]; });
      if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });
      updates.updatedAt = new Date();
      await db.collection('candidates').updateOne({ _id: oid }, { $set: updates });
      return res.json({ ok: true });
    } catch (err) {
      console.error('PUT /api/admin/candidates/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE: remove candidate (consider soft-delete)
  if (req.method === 'DELETE') {
    try {
      await db.collection('candidates').deleteOne({ _id: oid });
      // optionally remove or flag applications
      await db.collection('applications').updateMany({ candidateId: id }, { $set: { candidateRemoved: true } });
      return res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/admin/candidates/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end();
}
