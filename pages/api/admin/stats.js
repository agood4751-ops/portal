// pages/api/admin/stats.js
import { getDb } from '../../../lib/mongodb';

export default async function handler(req, res) {
  const db = await getDb();
  const newApplications = await db.collection('applications').countDocuments();
  const totalJobs = await db.collection('jobs').countDocuments();
  const totalCandidates = await db.collection('candidates').countDocuments();
  res.json({ newApplications, totalJobs, totalCandidates });
}
