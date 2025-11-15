// pages/api/admin/candidates/index.js
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
      const { q, limit = 200, page = 1 } = req.query;
      const filt = {};
      if (q) {
        filt.$or = [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } }
        ];
      }
      const lim = Math.min(1000, Number(limit) || 200);
      const skip = (Math.max(1, Number(page) || 1) - 1) * lim;
      const cursor = db.collection('candidates').find(filt).sort({ createdAt: -1 }).skip(skip).limit(lim);
      const docs = await cursor.toArray();
      const candidates = docs.map(d => ({ ...d, _id: d._id.toString() }));
      return res.json({ candidates });
    } catch (err) {
      console.error('GET /api/admin/candidates error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'GET');
  res.status(405).end();
}
