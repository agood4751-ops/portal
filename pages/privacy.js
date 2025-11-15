// pages/privacy.js
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="legal-container">
      <div className="legal-header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>
            <h1 className="legal-title">Privacy Policy</h1>
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
                <a href="#introduction" className="nav-link">1. Introduction</a>
                <a href="#information-collection" className="nav-link">2. Information We Collect</a>
                <a href="#how-we-use" className="nav-link">3. How We Use Information</a>
                <a href="#information-sharing" className="nav-link">4. Information Sharing</a>
                <a href="#data-security" className="nav-link">5. Data Security</a>
                <a href="#data-retention" className="nav-link">6. Data Retention</a>
                <a href="#your-rights" className="nav-link">7. Your Rights</a>
                <a href="#cookies" className="nav-link">8. Cookies & Tracking</a>
                <a href="#third-party" className="nav-link">9. Third-Party Services</a>
                <a href="#international" className="nav-link">10. International Transfers</a>
                <a href="#children" className="nav-link">11. Children's Privacy</a>
                <a href="#changes" className="nav-link">12. Policy Changes</a>
                <a href="#contact" className="nav-link">13. Contact Us</a>
              </nav>
            </div>

            <div className="main-content">
              <section id="introduction" className="section">
                <h2 className="section-title">1. Introduction</h2>
                <p>
                  Canada Jobs for Indians ("we," "our," or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you use our platform and services.
                </p>
                <p>
                  By using our Services, you consent to the data practices described in this policy. If you 
                  do not agree with the terms, please do not access or use our Services.
                </p>
              </section>

              <section id="information-collection" className="section">
                <h2 className="section-title">2. Information We Collect</h2>
                
                <h3 className="subsection-title">Personal Information</h3>
                <p>We collect information that identifies you as an individual:</p>
                <ul>
                  <li><strong>Contact Information:</strong> Name, email address, phone number</li>
                  <li><strong>Account Information:</strong> Username, password, profile details</li>
                  <li><strong>Professional Information:</strong> Resume, work experience, education, skills</li>
                  <li><strong>Application Data:</strong> Job applications, cover letters, interview details</li>
                  <li><strong>Documents:</strong> Uploaded resumes, certificates, identification documents</li>
                </ul>

                <h3 className="subsection-title">Automatically Collected Information</h3>
                <p>When you use our Services, we automatically collect:</p>
                <ul>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
                  <li><strong>Location Data:</strong> General location based on IP address</li>
                  <li><strong>Cookies and Tracking:</strong> See our Cookies section for details</li>
                </ul>
              </section>

              <section id="how-we-use" className="section">
                <h2 className="section-title">3. How We Use Your Information</h2>
                <p>We use your information for the following purposes:</p>
                <ul>
                  <li>Provide and maintain our Services</li>
                  <li>Process job applications and connect you with employers</li>
                  <li>Personalize your experience and show relevant job recommendations</li>
                  <li>Communicate with you about opportunities and platform updates</li>
                  <li>Improve our Services and develop new features</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section id="information-sharing" className="section">
                <h2 className="section-title">4. Information Sharing and Disclosure</h2>
                <p>We may share your information in the following circumstances:</p>

                <h3 className="subsection-title">With Employers</h3>
                <p>
                  When you apply for jobs, we share your application materials (resume, cover letter, 
                  profile information) with the relevant employers and their representatives.
                </p>

                <h3 className="subsection-title">Service Providers</h3>
                <p>
                  We engage trusted third parties to perform functions and provide services to us, 
                  such as hosting, analytics, customer support, and email delivery.
                </p>

                <h3 className="subsection-title">Legal Requirements</h3>
                <p>
                  We may disclose your information if required by law, regulation, or legal process, 
                  or to protect our rights, property, or safety.
                </p>

                <h3 className="subsection-title">Business Transfers</h3>
                <p>
                  In connection with a merger, acquisition, or sale of assets, your information may 
                  be transferred to the new entity.
                </p>
              </section>

              <section id="data-security" className="section">
                <h2 className="section-title">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or 
                  destruction. These measures include:
                </p>
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and monitoring</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage practices</li>
                </ul>
                <p>
                  However, no method of transmission over the Internet or electronic storage is 100% 
                  secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section id="data-retention" className="section">
                <h2 className="section-title">6. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes 
                  outlined in this Privacy Policy, unless a longer retention period is required or 
                  permitted by law. Specifically:
                </p>
                <ul>
                  <li>Active accounts: Until you request deletion</li>
                  <li>Job applications: As long as relevant for employment purposes</li>
                  <li>Inactive accounts: Up to 2 years after last activity</li>
                  <li>Legal requirements: As required by applicable laws</li>
                </ul>
              </section>

              <section id="your-rights" className="section">
                <h2 className="section-title">7. Your Rights and Choices</h2>
                <p>You have the following rights regarding your personal information:</p>
                <ul>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Restriction:</strong> Limit how we use your information</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information in the "Contact Us" section.
                </p>
              </section>

              <section id="cookies" className="section">
                <h2 className="section-title">8. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our Services 
                  and hold certain information. Cookies are files with a small amount of data that may 
                  include an anonymous unique identifier.
                </p>
                
                <h3 className="subsection-title">Types of Cookies We Use</h3>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences</li>
                  <li><strong>Targeting Cookies:</strong> Used for advertising and personalization</li>
                </ul>

                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is 
                  being sent. However, if you do not accept cookies, you may not be able to use some 
                  portions of our Services.
                </p>
              </section>

              <section id="third-party" className="section">
                <h2 className="section-title">9. Third-Party Services</h2>
                <p>
                  Our Services may contain links to third-party websites or services that are not owned 
                  or controlled by us. We have no control over, and assume no responsibility for, the 
                  content, privacy policies, or practices of any third-party sites or services.
                </p>
                <p>
                  We strongly advise you to review the privacy policy of every site you visit.
                </p>
              </section>

              <section id="international" className="section">
                <h2 className="section-title">10. International Data Transfers</h2>
                <p>
                  Your information, including personal data, may be transferred to — and maintained on — 
                  computers located outside of your state, province, country, or other governmental 
                  jurisdiction where the data protection laws may differ from those of your jurisdiction.
                </p>
                <p>
                  If you are located outside Canada and choose to provide information to us, please note 
                  that we transfer the data to Canada and process it there.
                </p>
              </section>

              <section id="children" className="section">
                <h2 className="section-title">11. Children's Privacy</h2>
                <p>
                  Our Services are not intended for individuals under the age of 18 ("Children"). We do 
                  not knowingly collect personally identifiable information from children under 18. If 
                  you are a parent or guardian and you are aware that your child has provided us with 
                  personal data, please contact us.
                </p>
              </section>

              <section id="changes" className="section">
                <h2 className="section-title">12. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes 
                  to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>

              <section id="contact" className="section">
                <h2 className="section-title">13. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="contact-info">
                  <p><strong>Email:</strong> privacy@canadajobsforindians.com</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                  <p><strong>Phone:</strong> [Your Contact Number]</p>
                </div>
                <p>
                  We will respond to your inquiry within 30 days.
                </p>
              </section>

              <div className="acknowledgement">
                <p>
                  By using Canada Jobs for Indians, you acknowledge that you have read and understood 
                  this Privacy Policy and consent to the collection, use, and sharing of your information 
                  as described herein.
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

        .subsection-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 0.75rem 0;
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

        .section strong {
          color: #111827;
        }

        .contact-info {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #dc2626;
          margin: 1rem 0;
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

          .subsection-title {
            font-size: 1.125rem;
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