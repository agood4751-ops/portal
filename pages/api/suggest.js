// pages/api/suggest.js
import { getDb } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const qRaw = String(req.query.q || '').trim();
    const type = String(req.query.type || 'title').toLowerCase(); 
    const limit = Math.min(50, Number(req.query.limit || 15));

    if (!qRaw || qRaw.length < 2) {
      return res.json({ suggestions: [] });
    }

    if (!['title', 'location'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const db = await getDb();

    const field = type === 'title' ? 'title' : 'location';

    // IMPROVEMENT: Robust Regex
    // 1. Escape special characters so input like "C++" doesn't crash regex
    // 2. Removed the '^' anchor so it finds text anywhere in the string
    const escapedInput = qRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedInput, 'i'); 

    const pipeline = [
      { $match: { [field]: { $regex: regex } } },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { _id: 1 } }
    ];

    const rows = await db.collection('jobs').aggregate(pipeline).toArray();
    const suggestions = rows.map(r => (r._id ? String(r._id).trim() : '')).filter(Boolean);

    return res.json({ suggestions });
  } catch (err) {
    console.error('Suggest API error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}