// pages/api/contact.js
import { getDb } from '../../lib/mongodb';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  try {
    const db = await getDb();
    await db.collection('contacts').insertOne({ name, email, message, createdAt: new Date() });

    // optional email (SMTP envs)
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          subject: `Contact form: ${name}`,
          html: `<p>${message}</p><p>From: ${name} &lt;${email}&gt;</p>`
        });
      } catch (e) {
        console.error('Contact email send failed', e);
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('contact error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
