// pages/api/candidate/upload.js
// Uploads files to GridFS and stores metadata in `files` collection.
// Uses formidable in a way that works across versions to avoid bundler issues.

import { getGridFSBucket, getDb } from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/auth';
import cookie from 'cookie';
import { ObjectId } from 'mongodb';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  // Use require() for formidable to avoid bundler interop issues
  // This works for v1 and v2+ of formidable
  const formidable = require('formidable');
  const Form = formidable.IncomingForm ? formidable.IncomingForm : formidable; // fallback

  const form = new Form({ keepExtensions: true, multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // get auth token if present
  const token = cookie.parse(req.headers.cookie || '').token;
  let user = null;
  if (token) {
    try { user = verifyToken(token); } catch (e) { /* ignore invalid token */ }
  }

  try {
    const { files } = await parseForm(req);

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const bucket = await getGridFSBucket();
    const db = await getDb();

    const saved = [];

    // files can be like { documents: File, resume: File, upload: [File,File] }
    for (const fieldName of Object.keys(files)) {
      const fileOrArr = files[fieldName];
      const list = Array.isArray(fileOrArr) ? fileOrArr : [fileOrArr];

      for (const f of list) {
        // Support both formidable v1 (f.path) and v2 (f.filepath)
        const tempPath = f.filepath || f.file || f.path || f.filepath;
        if (!tempPath || !fs.existsSync(tempPath)) {
          console.warn('upload: temp file missing for', f);
          continue;
        }

        const originalName = f.originalFilename || f.name || f.originalname || f.filename || 'upload';
        const mimetype = f.mimetype || f.type || 'application/octet-stream';
        const size = f.size || (f.stat && f.stat.size) || 0;

        const readStream = fs.createReadStream(tempPath);

        const uploadStream = bucket.openUploadStream(originalName, {
          contentType: mimetype,
          metadata: {
            uploaderId: user ? new ObjectId(user.sub) : null,
            field: fieldName,
            originalName,
            mimetype,
            size,
            uploadedAt: new Date()
          }
        });

        await new Promise((resolve, reject) => {
          readStream.pipe(uploadStream)
            .on('error', (err) => {
              console.error('GridFS upload error', err);
              reject(err);
            })
            .on('finish', () => resolve());
        });

        // Save a reference in a files collection
        const fileDoc = {
          _id: uploadStream.id,
          filename: uploadStream.filename,
          originalName,
          field: fieldName,
          uploaderId: user ? new ObjectId(user.sub) : null,
          mimetype,
          size,
          uploadedAt: new Date()
        };

        await db.collection('files').insertOne(fileDoc);

        saved.push({
          id: uploadStream.id.toString(),
          filename: uploadStream.filename,
          originalName,
          field: fieldName,
        });

        // try to remove temp file (best-effort)
        try { fs.unlinkSync(tempPath); } catch (e) { /* ignore */ }
      }
    }

    return res.json({ ok: true, files: saved });
  } catch (err) {
    console.error('UPLOAD ERROR', err);
    // Return friendly error but include details to debug
    return res.status(500).json({ error: 'Upload failed', details: err && err.message ? err.message : String(err) });
  }
}
