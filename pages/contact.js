// pages/contact.js
import { useState } from 'react';
import Image from 'next/image';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e?.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.message) { 
      setError('Please complete all fields'); 
      return; 
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { 
        method:'POST', 
        headers:{ 'Content-Type':'application/json' }, 
        body: JSON.stringify(form) 
      });
      const body = await res.json();
      if (!res.ok) { 
        setError(body.error || 'Send failed'); 
        setLoading(false); 
        return; 
      }
      setSent(true);
    } catch (err) {
      setError('Network error');
      console.error(err);
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                📞 Get In Touch
              </div>
              <h1 className="hero-title">
                We're Here to <span className="gradient-text">Help You</span>
              </h1>
              <p className="hero-description">
                Have questions about finding jobs in Canada? Need assistance with your application? 
                Our team is ready to support your Canadian career journey.
              </p>
            </div>
            <div className="hero-image">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Customer support team"
                width={500}
                height={400}
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>We'll get back to you within 2 business days</p>
              </div>

              {sent ? (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>
                    Thank you for reaching out. We've received your message and will reply to 
                    <strong> {form.email}</strong> soon.
                  </p>
                  <button 
                    onClick={() => setSent(false)}
                    className="btn btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="contact-form">
                  {error && (
                    <div className="error-message">
                      <span className="error-icon">⚠️</span>
                      {error}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input 
                      id="name"
                      className="form-input" 
                      placeholder="Enter your full name" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input 
                      id="email"
                      className="form-input" 
                      placeholder="Enter your email address" 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Your Message</label>
                    <textarea 
                      id="message"
                      className="form-textarea" 
                      placeholder="Tell us how we can help you..." 
                      rows="6" 
                      value={form.message} 
                      onChange={e => setForm({...form, message: e.target.value})} 
                    />
                  </div>
                  
                  <button 
                    className={`submit-btn ${loading ? 'loading' : ''}`} 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">✉️</span>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <div className="info-card">
                <h3>Contact Information</h3>
                <p>Choose your preferred method to reach us</p>
                
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon">📧</div>
                    <div className="method-info">
                      <h4>Email Us</h4>
                      <a href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'support@canadajobsforindians.com'}`}>
                        {process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'support@canadajobsforindians.com'}
                      </a>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">🕒</div>
                    <div className="method-info">
                      <h4>Response Time</h4>
                      <p>Within 2 business days</p>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">🌍</div>
                    <div className="method-info">
                      <h4>Service Hours</h4>
                      <p>Monday - Friday: 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                </div>

                <div className="support-tips">
                  <h4>Quick Support Tips:</h4>
                  <ul>
                    <li>Include your job preferences for faster assistance</li>
                    <li>Mention your current location and visa status</li>
                    <li>Attach your resume if relevant to your query</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-container {
          width: 100%;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Hero Section */
        .contact-hero {
          padding: 4rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .hero-image {
          position: relative;
        }

        .hero-img {
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        /* Contact Main Section */
        .contact-main {
          padding: 4rem 0;
          background: #f8fafc;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        /* Contact Form */
        .contact-form-section {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .form-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .form-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #64748b;
          font-size: 1.125rem;
        }

        .success-message {
          text-align: center;
          padding: 2rem;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .success-message h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #059669;
          margin-bottom: 1rem;
        }

        .success-message p {
          color: #64748b;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .contact-form {
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

        .form-input, .form-textarea {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .submit-btn {
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

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn.loading {
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

        /* Contact Information */
        .contact-info-section {
          position: sticky;
          top: 2rem;
        }

        .info-card {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .info-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .info-card > p {
          opacity: 0.8;
          margin-bottom: 2rem;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .contact-method {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .method-icon {
          font-size: 1.5rem;
          background: rgba(255,255,255,0.1);
          padding: 0.5rem;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .method-info h4 {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .method-info a {
          color: #60a5fa;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .method-info a:hover {
          color: #93c5fd;
        }

        .method-info p {
          opacity: 0.8;
        }

        .support-tips {
          background: rgba(255,255,255,0.1);
          padding: 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .support-tips h4 {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .support-tips ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .support-tips li {
          padding: 0.5rem 0;
          opacity: 0.9;
          position: relative;
          padding-left: 1.5rem;
        }

        .support-tips li:before {
          content: '•';
          color: #fbbf24;
          position: absolute;
          left: 0;
        }

        /* Buttons */
        .btn {
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .contact-grid {
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2rem;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .contact-info-section {
            position: static;
          }

          .contact-form-section,
          .info-card {
            padding: 2rem;
          }

          .hero-description {
            font-size: 1.125rem;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            padding: 2rem 0;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .contact-form-section,
          .info-card {
            padding: 1.5rem;
          }

          .form-header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}