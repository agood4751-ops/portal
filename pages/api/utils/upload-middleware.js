// pages/api/utils/upload-middleware.js
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export function uploadFields(fields = []) {
  return async (req, res) => {
    await runMiddleware(req, res, upload.fields(fields));
  };
}
