// pages/api/file/[id].js
import { ObjectId } from 'mongodb';
import { getGridFSBucket, getDb } from '../../../lib/mongodb';
import cookie from 'cookie';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing id' });

  let fileId;
  try {
    fileId = new ObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid file id' });
  }

  const db = await getDb();

  // find file metadata in our files collection (if exists)
  const fileRecord = await db.collection('files').findOne({ _id: fileId });

  // auth check
  const token = cookie.parse(req.headers.cookie || '').token;
  let payload = null;
  if (token) {
    try { payload = verifyToken(token); } catch (e) { /* invalid token -> not logged in */ }
  }

  const isAdmin = payload?.role === 'admin';
  const isOwner = payload && fileRecord && fileRecord.uploaderId && fileRecord.uploaderId.toString() === payload.sub;

  if (!isAdmin && !isOwner) {
    // For privacy, don't reveal if file exists; return 403
    return res.status(403).json({ error: 'Forbidden' });
  }

  const bucket = await getGridFSBucket();

  // find file doc in gridfs
  const filesColl = db.collection('fs.files');
  const fileDoc = await filesColl.findOne({ _id: fileId });

  if (!fileDoc) return res.status(404).json({ error: 'File not found' });

  res.setHeader('Content-Type', fileDoc.contentType || (fileRecord?.mimetype || 'application/octet-stream'));
  // set content-disposition for download with originalName if available
  const originalName = fileRecord?.originalName || fileDoc.filename || 'download';
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}"`);

  const downloadStream = bucket.openDownloadStream(fileId);

  downloadStream.on('error', (err) => {
    console.error('GridFS download error', err);
    if (!res.headersSent) res.status(500).end('Download error');
  });

  downloadStream.pipe(res);
}
