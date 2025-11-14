# Jobs Portal — Next.js + MongoDB Atlas (GridFS) Starter

## Overview
This project is a starter job portal that stores uploaded documents in MongoDB Atlas via GridFS. Designed for Vercel hosting + MongoDB Atlas.

## Setup
1. Create MongoDB Atlas cluster, get connection string, set `MONGODB_URI`.
2. Create SMTP credentials (or use SendGrid). Set `SMTP_*` env vars and `ADMIN_EMAIL`.
3. Create `.env.local` with variables (see above).
4. Install and run:
