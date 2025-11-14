// pages/api/candidate/profile.js
import cookie from 'cookie';
import { verifyToken } from '../../../lib/auth';
import { getDb } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = cookie.parse(req.headers.cookie || '').token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  const userId = payload.sub;
  const db = await getDb();

  if (req.method === 'GET') {
    const user = await db.collection('candidates').findOne({ _id: new ObjectId(userId) }, { projection: { password_hash: 0 } });
    if (!user) return res.status(404).json({ error: 'Not found' });

    // Fetch files associated with candidate from 'applications' and aggregate unique file refs (starter approach)
    const apps = await db.collection('applications').find({ email: user.email }).toArray();
    const files = [];
    for (const a of apps) {
      if (Array.isArray(a.files)) {
        for (const f of a.files) {
          // ensure unique
          if (!files.find(x => x.id && x.id.toString() === f.id.toString())) {
            files.push({ id: f.id, originalName: f.originalName || f.filename, field: f.field });
          }
        }
      }
    }

    res.json({ profile: { name: user.name, email: user.email, phone: user.phone, files } });
  } else if (req.method === 'PUT') {
    const updates = req.body || {};
    const allowed = {};
    if (updates.name) allowed.name = updates.name;
    if (updates.phone) allowed.phone = updates.phone;
    // if file ids provided (e.g., resume: fileId) we can track them in candidate doc
    if (updates.resume) allowed.resumeFileId = updates.resume;
    if (updates.passport) allowed.passportFileId = updates.passport;
    if (updates.permit) allowed.permitFileId = updates.permit;

    await db.collection('candidates').updateOne({ _id: new ObjectId(userId) }, { $set: allowed });
    const user = await db.collection('candidates').findOne({ _id: new ObjectId(userId) }, { projection: { password_hash: 0 }});
    res.json({ ok: true, profile: { name: user.name, email: user.email, phone: user.phone } });
  } else {
    res.status(405).end();
  }
}
