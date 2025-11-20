// pages/index.js
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import JobCard from '../components/JobCard';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function Home() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();
  const { data } = useSWR('/api/jobs', fetcher, { fallbackData: { jobs: [] } });

  const featured = (data?.jobs || []).filter(j => j.featured).slice(0,6);

  function onSearch(e){
    e?.preventDefault();
    const q = new URLSearchParams();
    if (title) q.set('title', title);
    if (location) q.set('location', location);
    router.push(`/jobs?${q.toString()}`);
  }

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                Made for Job Seekers
              </div>
              <h1 className="hero-title">
                Find Your Dream Job in 
                <span className="gradient-text"> Canada</span>
              </h1>
              <p className="hero-description">
                Unlock thousands of Canadian job opportunities designed for global talent. Enjoy seamless applications, smart document tracking, and exciting career growth.
              </p>

              <form className="search-form" onSubmit={onSearch}>
                <div className="search-inputs">
                  <div className="input-group">
                    <span className="input-icon">🔍</span>
                    <input 
                      className="search-input" 
                      placeholder="Job title, keywords, or company" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                  </div>
                  
                  <div className="input-group">
                    <span className="input-icon">📍</span>
                    <input 
                      className="search-input" 
                      placeholder="City, province, or postal code" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                    />
                  </div>
                  
                  <button className="search-button" type="submit">
                    Search Jobs
                    <span className="button-icon">🚀</span>
                  </button>
                </div>
              </form>

              <div className="hero-actions">
                <a href="/register" className="action-btn primary">
                  <span className="btn-icon">👤</span>
                  Create Free Account
                </a>
                <a href="/admin/login" className="action-btn secondary">
                  <span className="btn-icon">💼</span>
                  Employers / Admin
                </a>
              </div>

              <div className="hero-stats">
                <div className="stat">
                  <strong>10K+</strong>
                  <span>Jobs Available</span>
                </div>
                <div className="stat">
                  <strong>500+</strong>
                  <span>Companies</span>
                </div>
                <div className="stat">
                  <strong>95%</strong>
                  <span>Success Rate</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-container">
                <Image
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                  alt="Professionals working in modern office"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="visual-overlay"></div>
                
                {/* Floating elements */}
                <div className="floating-card card-1">
                  <div className="card-icon">💼</div>
                  <div className="card-text">
                    <strong>IT Jobs</strong>
                    <span>Toronto, ON</span>
                  </div>
                </div>
                
                <div className="floating-card card-2">
                  <div className="card-icon">🏥</div>
                  <div className="card-text">
                    <strong>Healthcare</strong>
                    <span>Vancouver, BC</span>
                  </div>
                </div>
                
                <div className="floating-card card-3">
                  <div className="card-icon">🔧</div>
                  <div className="card-text">
                    <strong>Engineering</strong>
                    <span>Calgary, AB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⭐</span>
              Featured Jobs
            </h2>
            <p className="section-subtitle">
              Hand-picked opportunities from top Canadian employers
            </p>
          </div>

          <div className="jobs-grid">
            {featured.length ? (
              featured.map(job => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No featured jobs available</h3>
                <p>Check back later for new opportunities</p>
              </div>
            )}
          </div>

          <div className="section-actions">
            <a href="/jobs" className="view-all-btn">
              View All Jobs
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-badge">Trusted & Secure</div>
            <p className="trust-text">
              Trusted by thousands of job seekers across Canada • Your privacy matters — please avoid uploading unnecessary personal information.
            </p>
            <div className="trust-features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                Secure Applications
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                Easy Tracking
              </div>
              <div className="feature">
                <span className="feature-icon">🇨🇦</span>
                Canada Focused
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 4rem 0 6rem;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          position: relative;
          z-index: 2;
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
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
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
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        /* Search Form */
        .search-form {
          margin-bottom: 2rem;
        }

        .search-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          background: white;
          padding: 1rem;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .input-group:focus-within {
          border-color: #667eea;
          background: white;
        }

        .input-icon {
          font-size: 1.25rem;
          opacity: 0.7;
        }

        .search-input {
          border: none;
          background: none;
          outline: none;
          font-size: 1rem;
          width: 100%;
          color: #1e293b;
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255,107,107,0.3);
        }

        .button-icon {
          font-size: 1.1rem;
        }

        /* Hero Actions */
        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #ffd700, #ffa500);
          color: #1e293b;
        }

        .action-btn.secondary {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        /* Hero Stats */
        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          color: white;
        }

        .stat strong {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .stat span {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        /* Hero Visual */
        .hero-visual {
          position: relative;
        }

        .visual-container {
          position: relative;
          height: 500px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3));
          z-index: 1;
        }

        .floating-card {
          position: absolute;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 1rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 2;
          animation: float 3s ease-in-out infinite;
        }

        .card-1 {
          top: 20%;
          left: -10%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 50%;
          right: -10%;
          animation-delay: 1s;
        }

        .card-3 {
          bottom: 20%;
          left: 20%;
          animation-delay: 2s;
        }

        .card-icon {
          font-size: 1.5rem;
        }

        .card-text {
          display: flex;
          flex-direction: column;
        }

        .card-text strong {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e293b;
        }

        .card-text span {
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Featured Section */
        .featured-section {
          padding: 6rem 0;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .title-icon {
          font-size: 2rem;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 500px;
          margin: 0 auto;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .section-actions {
          text-align: center;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1rem 2rem;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102,126,234,0.3);
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .view-all-btn:hover .arrow {
          transform: translateX(4px);
        }

        /* Trust Section */
        .trust-section {
          padding: 3rem 0;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
        }

        .trust-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .trust-badge {
          display: inline-block;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .trust-text {
          font-size: 1.125rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .trust-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .feature-icon {
          font-size: 1.25rem;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .search-inputs {
            grid-template-columns: 1fr;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 0 4rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1.125rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }

          .floating-card {
            display: none;
          }

          .visual-container {
            height: 300px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .action-btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.75rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .trust-features {
            flex-direction: column;
            gap: 1rem;
          }

          .search-inputs {
            padding: 0.75rem;
          }

          .input-group {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}