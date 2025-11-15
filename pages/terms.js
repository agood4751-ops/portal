// pages/terms.js
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <div className="container">
          <div className="header-content">
            <Link href="/">
              <a className="back-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Home
              </a>
            </Link>
            <h1 className="legal-title">Terms & Conditions</h1>
            <p className="legal-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="legal-content">
        <div className="container">
          <div className="content-wrapper">
            <div className="sidebar">
              <nav className="sidebar-nav">
                <h3 className="nav-title">Contents</h3>
                <a href="#acceptance" className="nav-link">1. Acceptance of Terms</a>
                <a href="#services" className="nav-link">2. Services Description</a>
                <a href="#registration" className="nav-link">3. Registration</a>
                <a href="#user-content" className="nav-link">4. User Content</a>
                <a href="#privacy" className="nav-link">5. Privacy</a>
                <a href="#intellectual-property" className="nav-link">6. Intellectual Property</a>
                <a href="#termination" className="nav-link">7. Termination</a>
                <a href="#disclaimer" className="nav-link">8. Disclaimer</a>
                <a href="#limitation" className="nav-link">9. Limitation of Liability</a>
                <a href="#governing-law" className="nav-link">10. Governing Law</a>
                <a href="#changes" className="nav-link">11. Changes to Terms</a>
                <a href="#contact" className="nav-link">12. Contact</a>
              </nav>
            </div>

            <div className="main-content">
              <section id="acceptance" className="section">
                <h2 className="section-title">1. Acceptance of Terms</h2>
                <p>
                  Welcome to Canada Jobs for Indians. By accessing or using our website, mobile application, 
                  or any other services (collectively, the "Services"), you agree to be bound by these Terms 
                  and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Services.
                </p>
              </section>

              <section id="services" className="section">
                <h2 className="section-title">2. Services Description</h2>
                <p>
                  Canada Jobs for Indians provides a platform connecting Indian job seekers with employment 
                  opportunities in Canada. Our Services include:
                </p>
                <ul>
                  <li>Job search and listing services</li>
                  <li>Application management tools</li>
                  <li>Document upload and storage</li>
                  <li>Employer-candidate communication</li>
                  <li>Career resources and information</li>
                </ul>
                <p>
                  We act as an intermediary platform and do not guarantee employment or verify the accuracy 
                  of all job listings.
                </p>
              </section>

              <section id="registration" className="section">
                <h2 className="section-title">3. Registration and Accounts</h2>
                <p>
                  To access certain features, you must register for an account. You agree to:
                </p>
                <ul>
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Be at least 18 years of age</li>
                </ul>
              </section>

              <section id="user-content" className="section">
                <h2 className="section-title">4. User Content</h2>
                <p>
                  By submitting content (resumes, cover letters, applications, etc.), you:
                </p>
                <ul>
                  <li>Grant us license to use, display, and distribute to potential employers</li>
                  <li>Warrant you have necessary rights to share the content</li>
                  <li>Agree not to submit illegal, fraudulent, or misleading content</li>
                  <li>Maintain responsibility for the accuracy of your information</li>
                </ul>
              </section>

              <section id="privacy" className="section">
                <h2 className="section-title">5. Privacy</h2>
                <p>
                  Your privacy is important to us. Please review our <Link href="/privacy"><a className="text-link">Privacy Policy</a></Link> 
                  to understand how we collect, use, and protect your personal information. By using our 
                  Services, you consent to our collection and use of data as described in the Privacy Policy.
                </p>
              </section>

              <section id="intellectual-property" className="section">
                <h2 className="section-title">6. Intellectual Property</h2>
                <p>
                  All content on our platform, including text, graphics, logos, and software, is our 
                  property or licensed to us and protected by copyright and other intellectual property laws. 
                  You may not reproduce, distribute, or create derivative works without our permission.
                </p>
              </section>

              <section id="termination" className="section">
                <h2 className="section-title">7. Termination</h2>
                <p>
                  We may suspend or terminate your account at our sole discretion if you violate these Terms. 
                  You may terminate your account at any time by contacting us or using account deletion tools.
                </p>
              </section>

              <section id="disclaimer" className="section">
                <h2 className="section-title">8. Disclaimer of Warranties</h2>
                <p>
                  Our Services are provided "as is" and "as available" without warranties of any kind. 
                  We do not guarantee:
                </p>
                <ul>
                  <li>Continuous, uninterrupted, or secure access to our Services</li>
                  <li>Accuracy or completeness of job listings</li>
                  <li>Employment opportunities or job offers</li>
                  <li>Employer responses to applications</li>
                </ul>
              </section>

              <section id="limitation" className="section">
                <h2 className="section-title">9. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Canada Jobs for Indians shall not be liable for 
                  any indirect, incidental, special, or consequential damages resulting from:
                </p>
                <ul>
                  <li>Your use or inability to use our Services</li>
                  <li>Unauthorized access to your transmissions or data</li>
                  <li>Statements or conduct of any third party</li>
                  <li>Any other matter relating to our Services</li>
                </ul>
              </section>

              <section id="governing-law" className="section">
                <h2 className="section-title">10. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of Canada and 
                  the Province of Ontario, without regard to its conflict of law provisions.
                </p>
              </section>

              <section id="changes" className="section">
                <h2 className="section-title">11. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of significant 
                  changes through our platform or via email. Continued use after changes constitutes acceptance 
                  of the modified Terms.
                </p>
              </section>

              <section id="contact" className="section">
                <h2 className="section-title">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="contact-info">
                  <p><strong>Email:</strong> legal@canadajobsforindians.com</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                </div>
              </section>

              <div className="acknowledgement">
                <p>
                  By using Canada Jobs for Indians, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .legal-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .legal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 3rem 0;
        }

        .header-content {
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 1rem;
          opacity: 0.9;
          transition: opacity 0.3s ease;
        }

        .back-link:hover {
          opacity: 1;
        }

        .legal-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .legal-subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0;
        }

        .legal-content {
          padding: 3rem 0;
        }

        .content-wrapper {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
          align-items: start;
        }

        .sidebar {
          position: sticky;
          top: 2rem;
        }

        .sidebar-nav {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .nav-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .nav-link {
          display: block;
          padding: 0.75rem 0;
          color: #374151;
          text-decoration: none;
          font-size: 0.95rem;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #dc2626;
          transform: translateX(4px);
        }

        .nav-link:last-child {
          border-bottom: none;
        }

        .main-content {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .section {
          margin-bottom: 3rem;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .section p {
          color: #374151;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .section ul {
          color: #374151;
          line-height: 1.7;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .section li {
          margin-bottom: 0.5rem;
        }

        .text-link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 500;
        }

        .text-link:hover {
          text-decoration: underline;
        }

        .contact-info {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #dc2626;
        }

        .contact-info p {
          margin-bottom: 0.5rem;
        }

        .contact-info p:last-child {
          margin-bottom: 0;
        }

        .acknowledgement {
          background: #fef2f2;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #fecaca;
          margin-top: 3rem;
          text-align: center;
        }

        .acknowledgement p {
          font-weight: 600;
          color: #dc2626;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 250px 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .legal-header {
            padding: 2rem 0;
          }

          .legal-title {
            font-size: 2.5rem;
          }

          .content-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .sidebar {
            position: static;
          }

          .main-content {
            padding: 2rem;
          }

          .section-title {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .legal-header {
            padding: 1.5rem 0;
          }

          .legal-title {
            font-size: 2rem;
          }

          .legal-content {
            padding: 1.5rem 0;
          }

          .main-content {
            padding: 1.5rem;
          }

          .sidebar-nav {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}