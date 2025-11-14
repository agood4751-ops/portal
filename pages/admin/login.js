// pages/admin/login.js
import { useState } from 'react';
import Router from 'next/router';

export default function AdminLogin() {
  const [form, setForm] = useState({ email:'', password:'' });

  async function submit(e) {
    e.preventDefault();
    // For starter: reuse candidate login; in production create a separate admin auth with role checks
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if (!res.ok) return alert('Login failed');
    Router.push('/admin/dashboard');
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
