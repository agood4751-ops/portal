// pages/api/apply.js
import { getDb, getGridFSBucket } from '../lib/mongodb';
import { uploadFields } from './utils/upload-middleware';
import streamifier from 'streamifier';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false
  }
};

const FIELDS = [
  { name: 'resume', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'permit', maxCount: 1 },
  { name: 'otherDocs', maxCount: 5 }
];

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // parse multipart via multer memory: will populate req.files and req.body
  await uploadFields(FIELDS)(req, res);

  const body = req.body || {};
  const files = req.files || {};
  const { jobId, name, email, phone, message } = body;
  if (!jobId || !name || !email || !files.resume) {
    return res.status(400).json({ error: 'Missing jobId, name, email, or resume' });
  }

  const db = await getDb();
  const bucket = await getGridFSBucket();

  const savedFiles = [];

  // helper to upload buffer to GridFS and return file record
  async function saveBufferToGridFS(buffer, filename, metadata = {}) {
    const uploadStream = bucket.openUploadStream(filename, { metadata });
    const stream = streamifier.createReadStream(buffer);
    stream.pipe(uploadStream);
    await new Promise((resolve, reject) => {
      uploadStream.on('finish', () => resolve());
      uploadStream.on('error', (err) => reject(err));
    });
    return {
      id: uploadStream.id, // ObjectId
      filename,
      metadata,
      length: uploadStream.length
    };
  }

  try {
    // resume
    const resumeFile = files.resume[0];
    const resumeMeta = await saveBufferToGridFS(resumeFile.buffer, `${Date.now()}_resume_${resumeFile.originalname}`, {
      field: 'resume',
      originalName: resumeFile.originalname,
      mime: resumeFile.mimetype
    });
    savedFiles.push({ ...resumeMeta, originalName: resumeFile.originalname, mime: resumeFile.mimetype, field: 'resume' });

    // passport
    if (files.passport && files.passport[0]) {
      const pf = files.passport[0];
      const pm = await saveBufferToGridFS(pf.buffer, `${Date.now()}_passport_${pf.originalname}`, { field: 'passport', originalName: pf.originalname, mime: pf.mimetype });
      savedFiles.push({ ...pm, originalName: pf.originalname, mime: pf.mimetype, field: 'passport' });
    }

    // permit
    if (files.permit && files.permit[0]) {
      const pf = files.permit[0];
      const pm = await saveBufferToGridFS(pf.buffer, `${Date.now()}_permit_${pf.originalname}`, { field: 'permit', originalName: pf.originalname, mime: pf.mimetype });
      savedFiles.push({ ...pm, originalName: pf.originalname, mime: pf.mimetype, field: 'permit' });
    }

    // otherDocs
    if (files.otherDocs && files.otherDocs.length) {
      for (const ofi of files.otherDocs) {
        const om = await saveBufferToGridFS(ofi.buffer, `${Date.now()}_other_${ofi.originalname}`, { field: 'otherDocs', originalName: ofi.originalname, mime: ofi.mimetype });
        savedFiles.push({ ...om, originalName: ofi.originalname, mime: ofi.mimetype, field: 'otherDocs' });
      }
    }

    // Save application doc
    const jobDoc = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
    const application = {
      jobId: new ObjectId(jobId),
      jobTitle: jobDoc?.title || null,
      name,
      email: email.toLowerCase(),
      phone,
      message,
      files: savedFiles.map(f => ({ id: f.id, filename: f.filename, originalName: f.originalName, field: f.field })),
      status: 'Applied',
      createdAt: new Date()
    };
    const r = await db.collection('applications').insertOne(application);

    // Send email to admin (optional but included)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const fileLinks = savedFiles.map(f => {
        return `${process.env.NEXT_PUBLIC_APP_URL}/api/file/${f.id.toString()}`;
      }).join('<br/>');

      const html = `<p>New application from <b>${name}</b> (${email}) for job <b>${jobDoc?.title || jobId}</b></p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message || ''}</p>
        <p>Files:<br/>${fileLinks}</p>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New application: ${name}`,
        html
      });
    } catch (err) {
      console.error('Email error', err);
    }

    res.json({ ok: true, id: r.insertedId });
  } catch (err) {
    console.error('apply error', err);
    res.status(500).json({ error: 'Upload failed' });
  }
}

export default handler;
