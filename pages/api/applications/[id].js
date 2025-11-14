// pages/api/applications/[id].js
import { ObjectId } from 'mongodb';
import { getDb } from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';

export default async function handler(req, res) {
  const db = await getDb();
  const { id } = req.query;

  if (!id || !ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

  // parse token if present
  const token = cookie.parse(req.headers.cookie || '').token;
  let payload = null;
  if (token) {
    try { payload = verifyToken(token); } catch (e) { payload = null; }
  }

  if (req.method === 'GET') {
    try {
      const app = await db.collection('applications').findOne({ _id: new ObjectId(id) });
      if (!app) return res.status(404).json({ error: 'Not found' });

      const isAdmin = payload?.role === 'admin';
      const isOwner = payload && app.candidateId && app.candidateId.toString() === payload.sub;

      if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Forbidden' });

      // convert ObjectIds to strings for client convenience
      const out = {
        ...app,
        _id: app._id.toString(),
        jobId: app.jobId ? app.jobId.toString() : null,
        candidateId: app.candidateId ? app.candidateId.toString() : null,
      };
      return res.json({ application: out });
    } catch (err) {
      console.error('GET /api/applications/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Allow candidate to update their message before review (PATCH), or admin to update some fields if needed
  if (req.method === 'PATCH') {
    try {
      const app = await db.collection('applications').findOne({ _id: new ObjectId(id) });
      if (!app) return res.status(404).json({ error: 'Not found' });

      const isAdmin = payload?.role === 'admin';
      const isOwner = payload && app.candidateId && app.candidateId.toString() === payload.sub;

      if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Forbidden' });

      const body = req.body || {};
      const updates = {};

      // Candidate can update message and phone/email if anonymous (we allow limited edits)
      if (isOwner && typeof body.message === 'string') updates.message = body.message;
      if (isOwner && typeof body.phone === 'string') updates.phone = body.phone;
      if (isOwner && typeof body.email === 'string') updates.email = body.email;

      // Admin can update status, feeStatus, reminderAt, and add notes via separate admin endpoint (but allow here for convenience)
      if (isAdmin) {
        if (typeof body.status === 'string') updates.status = body.status;
        if (typeof body.feeStatus === 'string') updates.feeStatus = body.feeStatus;
        if (body.reminderAt) updates.reminderAt = new Date(body.reminderAt);
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      await db.collection('applications').updateOne({ _id: new ObjectId(id) }, { $set: updates });
      return res.json({ ok: true });
    } catch (err) {
      console.error('PATCH /api/applications/[id] error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  res.status(405).end();
}
