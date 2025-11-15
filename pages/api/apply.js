// pages/api/apply.js
// Compatibility wrapper: forwards JSON POSTs to /api/applications handler
import applicationsHandler from './applications/index';

export default async function handler(req, res) {
  // Only forward JSON POSTS. If you want multipart here you can implement combined handling.
  if (req.method === 'POST') {
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (contentType.startsWith('application/json')) {
      // forward to canonical handler (it expects req.body etc)
      return applicationsHandler(req, res);
    }

    // For multipart/form-data requests: return explicit instruction (safer than attempting to parse here)
    return res.status(400).json({
      error: 'This endpoint accepts JSON. To upload files first POST multipart/form-data to /api/candidate/upload and then POST JSON to /api/applications with file ids.'
    });
  }

  res.setHeader('Allow', 'POST');
  res.status(405).end();
}
