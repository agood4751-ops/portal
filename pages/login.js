// pages/login.js
import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { 
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) 
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Login failed');
      
      window.dispatchEvent(new Event('auth-change'));
      Router.push('/candidate/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">🇨🇦 Canada Jobs</div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your applications</p>
        </div>

        {error && <div className="error-banner">⚠️ {error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" required value={form.email} placeholder="you@example.com"
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type={showPass ? "text" : "password"} required value={form.password} placeholder="••••••••"
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="showPass" checked={showPass} onChange={() => setShowPass(!showPass)} />
            <label htmlFor="showPass">Show Password</label>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link href="/register">Create one</Link>
        </div>
      </div>

      <style jsx>{`
        .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9; padding: 1rem; font-family: sans-serif; }
        .auth-card { background: white; width: 100%; max-width: 400px; padding: 2.5rem; border-radius: 1.5rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .auth-header { text-align: center; margin-bottom: 2rem; }
        .logo { font-weight: 800; font-size: 1.25rem; color: #dc2626; margin-bottom: 1rem; }
        h1 { font-size: 1.75rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0; }
        p { color: #64748b; margin: 0; }
        .error-banner { background: #fef2f2; color: #b91c1c; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; text-align: center; }
        .form-group { margin-bottom: 1.25rem; }
        label { display: block; font-size: 0.875rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem; font-size: 1rem; transition: 0.2s; }
        input:focus { outline: none; border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1); }
        .checkbox-group { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: #64748b; }
        .checkbox-group input { width: auto; accent-color: #dc2626; }
        .submit-btn { width: 100%; background: #dc2626; color: white; padding: 0.875rem; border-radius: 0.75rem; font-weight: 600; border: none; cursor: pointer; transition: 0.2s; }
        .submit-btn:hover:not(:disabled) { background: #b91c1c; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 2rem; font-size: 0.9rem; color: #64748b; }
        .auth-footer a { color: #dc2626; text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
}