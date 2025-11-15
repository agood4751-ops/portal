// pages/api/debug/check-admin.js
// TEMP DEBUG — remove after done
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  const key = req.query._key;
  if (!key || key !== process.env.DEBUG_ENDPOINT_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // connectToDatabase returns { client, db } in your lib
    const { client, db } = await connectToDatabase();
    // db.databaseName shows which DB the driver is currently using
    const dbName = db.databaseName || null;

    const u = await db.collection('users').findOne({ email: 'admin@admin.com' });
    return res.json({
      found: !!u,
      dbName,
      hasPasswordHash: !!(u && (u.passwordHash || u.password)),
      id: u ? (u._id && u._id.toString ? u._id.toString() : null) : null
    });
  } catch (err) {
    console.error('debug/check-admin error', err);
    return res.status(500).json({ error: 'server error', details: err.message });
  }
}
