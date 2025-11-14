// scripts/test-db.js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set. Check .env.local in project root.');
      process.exit(2);
    }
    await mongoose.connect(process.env.MONGODB_URI, { dbName: undefined });
    console.log('MongoDB Connected OK');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB FAIL:', err);
    process.exit(1);
  }
})();
