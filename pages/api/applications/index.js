// pages/api/applications/index.js
import { ObjectId } from 'mongodb';
import { getDb } from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const db = await getDb();

  if (req.method === 'POST') {
    // Allow authenticated candidate or anonymous application (with name/email in body).
    // Use cookie token if present to attach candidateId automatically.
    const token = cookie.parse(req.headers.cookie || '').token;
    let user = null;
    if (token) {
      try {
        user = verifyToken(token);
      } catch (e) {
        // invalid token -> treat as anonymous (we don't force auth here)
        user = null;
      }
    }

    const body = req.body || {};
    const { jobId, message = '', files = [], name, email, phone } = body;

    if (!jobId) return res.status(400).json({ error: 'Missing jobId' });
    // basic validation: either logged-in user or provided name+email
    if (!user && (!name || !email)) {
      return res.status(400).json({ error: 'Anonymous apply requires name and email' });
    }

    // verify job exists
    try {
      if (!ObjectId.isValid(jobId)) return res.status(400).json({ error: 'Invalid jobId' });
      const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
      if (!job) return res.status(404).json({ error: 'Job not found' });

      const doc = {
        jobId: new ObjectId(jobId),
        jobTitle: job.title || '',
        jobEmployer: job.employer || '',
        candidateId: user ? new ObjectId(user.sub) : null,
        name: user ? undefined : (name || ''),
        email: user ? undefined : (email || ''),
        phone: user ? undefined : (phone || ''),
        message: message || '',
        files: Array.isArray(files) ? files : [],
        status: 'Applied',
        notes: [],
        feeStatus: null,
        reminderAt: null,
        createdAt: new Date()
      };

      // If user exists, fetch candidate contact info (optional)
      if (user) {
        const cand = await db.collection('candidates').findOne({ _id: new ObjectId(user.sub) });
        if (cand) {
          doc.name = cand.name || doc.name;
          doc.email = cand.email || doc.email;
          doc.phone = cand.phone || doc.phone;
        }
      }

      const r = await db.collection('applications').insertOne(doc);

      // Optional: send notification email to ADMIN_EMAIL if configured
      try {
        if (process.env.SMTP_HOST && process.env.ADMIN_EMAIL) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          });

          const html = `<p>New application for <strong>${job.title}</strong> at <strong>${job.employer}</strong>.</p>
                        <p>Candidate: ${doc.name || (user && user.email) || 'Anonymous'} (${doc.email || (user && user.email) || ''})</p>
                        <p>Message: ${doc.message || '(none)'}</p>
                        <p><em>Application ID: ${r.insertedId.toString()}</em></p>`;

          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New application: ${job.title}`,
            html
          });
        }
      } catch (e) {
        console.error('Notification email failed', e);
      }

      return res.status(201).json({ ok: true, id: r.insertedId.toString() });
    } catch (err) {
      console.error('POST /api/applications error', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end();
}
