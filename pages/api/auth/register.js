// pages/api/auth/register.js
import { getDb } from '../../../lib/mongodb';
import { hashPassword, createToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields (name, email, password)' });
    }

    if (!/^[A-Za-z0-9]{6}$/.test(password)) {
      return res.status(400).json({ error: 'Password must be exactly 6 alphanumeric characters' });
    }

    const db = await getDb();

    const existing = await db.collection('candidates').findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await hashPassword(password);

    const doc = {
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password_hash,
      role: 'candidate',
      createdAt: new Date()
    };

    const r = await db.collection('candidates').insertOne(doc);

    // create JWT and set cookie
    const token = createToken({ sub: r.insertedId.toString(), role: 'candidate', email: doc.email });
    setTokenCookie(res, token);

    return res.status(201).json({ ok: true, id: r.insertedId.toString() });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
