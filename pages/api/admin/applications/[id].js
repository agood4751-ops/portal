// pages/api/admin/applications/[id].js
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

  if (req.method === 'GET') {
    try {
      const app = await db.collection('applications').findOne({ _id: new ObjectId(id) });
      if (!app) return res.status(404).json({ error: 'Not found' });
      const out = {
        ...app,
        _id: app._id.toString(),
        jobId: app.jobId ? app.jobId.toString() : null,
        candidateId: app.candidateId ? app.candidateId.toString() : null
      };
      return res.json({ application: out });
    } catch (err) {
      console.error('GET /api/admin/applications/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update status, feeStatus, reminder or add notes
  if (req.method === 'PUT') {
    try {
      const body = req.body || {};
      const updates = {};
      if (typeof body.status === 'string') updates.status = body.status;
      if (typeof body.feeStatus === 'string') updates.feeStatus = body.feeStatus;
      if (body.reminderAt) updates.reminderAt = new Date(body.reminderAt);

      if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

      await db.collection('applications').updateOne({ _id: new ObjectId(id) }, { $set: updates });
      return res.json({ ok: true });
    } catch (err) {
      console.error('PUT /api/admin/applications/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST: add an admin note { note: 'text' }
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { note } = body;
      if (!note) return res.status(400).json({ error: 'Missing note' });
      const noteObj = { adminId: payload.sub, adminName: payload.email || payload.name || 'Admin', note, createdAt: new Date() };
      await db.collection('applications').updateOne({ _id: new ObjectId(id) }, { $push: { notes: noteObj } });
      return res.json({ ok: true });
    } catch (err) {
      console.error('POST /api/admin/applications/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, POST');
  res.status(405).end();
}
