// pages/api/admin/jobs/[id].js
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

  if (req.method === 'GET') {
    try {
      const job = await db.collection('jobs').findOne({ _id: oid });
      if (!job) return res.status(404).json({ error: 'Not found' });
      job._id = job._id.toString();
      return res.json({ job });
    } catch (err) {
      console.error('GET /api/admin/jobs/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const updates = {};
      const fields = ['title','employer','field','salary','type','location','description','featured'];
      fields.forEach(f => { if (typeof body[f] !== 'undefined') updates[f] = body[f]; });
      if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });
      updates.updatedAt = new Date();
      await db.collection('jobs').updateOne({ _id: oid }, { $set: updates });
      return res.json({ ok: true });
    } catch (err) {
      console.error('PUT /api/admin/jobs/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // consider soft-delete instead in production
      await db.collection('jobs').deleteOne({ _id: oid });
      // optionally cascade: leave applications as-is or set jobRemoved flag
      await db.collection('applications').updateMany({ jobId: id }, { $set: { jobRemoved: true } });
      return res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/admin/jobs/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).end();
}
