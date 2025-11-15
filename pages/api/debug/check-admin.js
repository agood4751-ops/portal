// pages/api/debug/check-admin.js
// TEMP DEBUG — remove this file after debugging
import { getDb } from '../../../lib/mongodb';

export default async function handler(req, res) {
  // require a secret query param to reduce accidental exposure (use a random string)
  const key = req.query._key;
  if (!key || key !== process.env.DEBUG_ENDPOINT_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const db = await getDb();
    const u = await db.collection('users').findOne({ email: 'admin@admin.com' });
    if (!u) return res.json({ found: false });

    // Don't return password hash - only show presence and meta
    return res.json({
      found: true,
      _id: u._id?.toString?.() || null,
      email: u.email,
      role: u.role,
      hasPasswordHash: !!(u.passwordHash || u.password),
      createdAt: u.createdAt || null,
      createdByScript: !!u.createdByScript
    });
  } catch (err) {
    console.error('debug/check-admin error', err);
    return res.status(500).json({ error: 'server error', details: err.message });
  }
}
