// pages/api/auth/login.js
import { getDb } from '../../../lib/mongodb';
import { verifyPassword, createToken, setTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing' });

  const db = await getDb();
  const user = await db.collection('candidates').findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = createToken({ sub: user._id.toString(), role: user.role || 'candidate', email: user.email });
  setTokenCookie(res, token);
  res.json({ ok: true });
}
