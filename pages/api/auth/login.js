// pages/api/auth/login.js
import { getDb } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    const db = await getDb();
    // look up in users collection (admins are here). Adjust if your app expects a different collection.
    const user = await db.collection('users').findOne({ email: String(email).toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hash = user.passwordHash || user.password; // support both field names
    if (!hash) {
      console.warn('User missing password hash:', user._id);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Build token payload
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role || 'candidate',
      name: user.name || ''
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_me', { expiresIn: '7d' });

    // Set secure cookie (HttpOnly). In production add Secure flag automatically.
    const cookieParts = [
      `token=${token}`,
      'HttpOnly',
      'Path=/',
      'SameSite=Lax',
      `Max-Age=${7 * 24 * 60 * 60}`
    ];
    if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    return res.json({ ok: true, user: { id: payload.sub, email: payload.email, role: payload.role, name: payload.name } });
  } catch (err) {
    console.error('LOGIN ERROR', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
