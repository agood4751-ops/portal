// pages/login.js
import { useState } from 'react';
import Router from 'next/router';
import Image from 'next/image';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify(form) 
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }
      
      window.dispatchEvent(new Event('auth-change'));
      try { 
        localStorage.setItem('auth-change', Date.now().toString()); 
      } catch(e){}
      Router.push('/candidate/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-grid">
        {/* Left Side - Form */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-header">
              <div className="logo">
                <span className="logo-icon">🇨🇦</span>
                <span className="logo-text">Canada Jobs</span>
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to your candidate account</p>
            </div>

            <form onSubmit={submit} className="auth-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  id="email"
                  type="email"
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  placeholder="Enter your email address"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                  id="password"
                  type="password" 
                  value={form.password} 
                  onChange={e => setForm({...form, password: e.target.value})} 
                  placeholder="Enter your password"
                  className="form-input"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <a href="/register" className="auth-link">Create one here</a>
              </p>
              <p>
                <a href="/forgot-password" className="auth-link text-sm">Forgot your password?</a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="auth-visual-section">
          <div className="visual-content">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Professionals working"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="visual-overlay"></div>
            <div className="visual-text">
              <h2>Your Canadian Career Awaits</h2>
              <p>Access your personalized dashboard to track applications and discover new opportunities</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .auth-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          width: 100%;
        }

        /* Form Section */
        .auth-form-section {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-card {
          background: white;
          padding: 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 450px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
        }

        .auth-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #64748b;
          font-size: 1.125rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-input {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .auth-submit-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 1.25rem 2rem;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .auth-submit-btn.loading {
          background: #9ca3af;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .auth-footer p {
          color: #64748b;
          margin: 0.5rem 0;
        }

        .auth-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .auth-link:hover {
          color: #5a67d8;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        /* Visual Section */
        .auth-visual-section {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .visual-content {
          position: relative;
          height: 100%;
          width: 100%;
        }

        .visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(102,126,234,0.9), rgba(118,75,162,0.9));
          z-index: 1;
        }

        .visual-text {
          position: absolute;
          bottom: 4rem;
          left: 4rem;
          right: 4rem;
          color: white;
          z-index: 2;
        }

        .visual-text h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .visual-text p {
          font-size: 1.25rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .visual-text {
            left: 2rem;
            right: 2rem;
            bottom: 2rem;
          }

          .visual-text h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .auth-grid {
            grid-template-columns: 1fr;
          }

          .auth-visual-section {
            display: none;
          }

          .auth-form-section {
            padding: 1rem;
          }

          .auth-card {
            padding: 2rem;
          }
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem;
          }

          .auth-header h1 {
            font-size: 1.75rem;
          }

          .logo-text {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}