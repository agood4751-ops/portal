// pages/about.js
import Image from 'next/image';

export default function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                🇨🇦 About Canada Jobs for Indians
              </div>
              <h1 className="hero-title">
                Bridging Dreams Between 
                <span className="gradient-text"> India & Canada</span>
              </h1>
              <p className="hero-description">
                We are dedicated to helping Indian professionals build successful careers in Canada. 
                From entry-level positions to specialized roles, we connect talent with opportunity 
                in the Great White North.
              </p>
            </div>
            <div className="hero-image">
              <Image
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Indian professionals in Canada"
                width={600}
                height={400}
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To simplify the Canadian job search for Indian professionals by providing 
                curated opportunities, streamlined applications, and comprehensive support 
                throughout the employment journey.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                Creating a world where every Indian professional can easily access and 
                succeed in the Canadian job market, contributing to both countries' economic growth.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🚀</div>
              <h3>Our Promise</h3>
              <p>
                Authentic job listings, transparent processes, and dedicated support to 
                ensure your Canadian career dreams become reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Canada Jobs for Indians?</h2>
            <p>We understand the unique challenges faced by Indian job seekers in Canada</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Curated Job Listings</h4>
              <p>Hand-picked opportunities across all Canadian provinces and territories</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📄</div>
              <h4>Document Management</h4>
              <p>Secure upload and storage of resumes, cover letters, and certifications</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Application Tracking</h4>
              <p>Real-time tracking of your job applications and interview status</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h4>Employer Verified</h4>
              <p>All employers and job listings are thoroughly verified for authenticity</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h4>Canada-Wide Coverage</h4>
              <p>Opportunities from Vancouver to Halifax, including remote positions</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">💼</div>
              <h4>Career Resources</h4>
              <p>Access to Canadian workplace culture guides and interview tips</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Your journey to Canadian employment in 4 simple steps</p>
          </div>
          
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Profile</h3>
                <p>Sign up and build your comprehensive candidate profile with work experience, education, and skills</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Upload Documents</h3>
                <p>Securely upload your resume, cover letters, and relevant certifications to your personal dashboard</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Find Opportunities</h3>
                <p>Browse curated job listings from Canadian employers actively seeking Indian talent</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Apply & Track</h3>
                <p>Submit applications and track their progress through our intuitive dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="stories-section">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Hear from Indians who found their dream jobs in Canada</p>
          </div>
          
          <div className="stories-grid">
            <div className="story-card">
              <Image
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Priya Sharma"
                width={80}
                height={80}
                className="story-avatar"
              />
              <h4>Priya Sharma</h4>
              <p className="story-role">Software Developer, Toronto</p>
              <p className="story-text">
                "Within 2 weeks of creating my profile, I had 3 interviews. The platform made 
                my transition from Mumbai to Toronto seamless!"
              </p>
            </div>
            
            <div className="story-card">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Raj Patel"
                width={80}
                height={80}
                className="story-avatar"
              />
              <h4>Raj Patel</h4>
              <p className="story-role">Marketing Manager, Vancouver</p>
              <p className="story-text">
                "The document management system saved me so much time. I could apply to multiple 
                jobs with just a few clicks!"
              </p>
            </div>
            
            <div className="story-card">
              <Image
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Anita Reddy"
                width={80}
                height={80}
                className="story-avatar"
              />
              <h4>Anita Reddy</h4>
              <p className="story-role">Healthcare Professional, Calgary</p>
              <p className="story-text">
                "As a nurse moving from Delhi, the platform helped me understand Canadian 
                healthcare requirements and find the perfect role."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Canadian Journey?</h2>
            <p>Join thousands of Indian professionals who have found success in Canada</p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary">Create Your Account</a>
              <a href="/jobs" className="btn btn-secondary">Browse Jobs</a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-container {
          width: 100%;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Hero Section */
        .about-hero {
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

        /* Mission Section */
        .mission-section {
          padding: 4rem 0;
          background: white;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mission-card {
          text-align: center;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .mission-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .mission-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .mission-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .mission-card p {
          color: #64748b;
          line-height: 1.6;
        }

        /* Features Section */
        .features-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-item {
          text-align: center;
          padding: 2rem 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-item h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .feature-item p {
          color: #64748b;
          line-height: 1.6;
        }

        /* Process Section */
        .process-section {
          padding: 4rem 0;
          background: white;
        }

        .process-steps {
          display: grid;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 16px;
          border-left: 4px solid #667eea;
        }

        .step-number {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .step-content p {
          color: #64748b;
          line-height: 1.6;
        }

        /* Stories Section */
        .stories-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .story-card {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .story-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }

        .story-avatar {
          border-radius: 50%;
          margin: 0 auto 1rem;
        }

        .story-card h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .story-role {
          color: #667eea;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .story-text {
          color: #64748b;
          line-height: 1.6;
          font-style: italic;
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1.125rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .step {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .about-hero {
            padding: 2rem 0;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .mission-grid,
          .features-grid,
          .stories-grid {
            grid-template-columns: 1fr;
          }

          .section-header h2 {
            font-size: 1.75rem;
          }

          .cta-content h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}