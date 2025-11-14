// pages/jobs/[id].js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';

const fetcher = (u) => fetch(u).then(r => r.json());

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(() => id ? `/api/jobs/${id}` : null, fetcher);

  const job = data?.job;

  if (error) {
    return (
      <div className="job-detail-container">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Job Not Found</h2>
            <p>The job you're looking for doesn't exist or has been removed.</p>
            <Link href="/jobs" className="btn btn-primary">Browse All Jobs</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-detail-container">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Format salary for display
  const formatSalary = (pay) => {
    if (!pay || pay === 'Not specified') return 'Salary not specified';
    return pay;
  };

  // Get field color
  const getFieldColor = (field) => {
    const colors = {
      'Technology': '#3b82f6',
      'Healthcare': '#10b981',
      'Engineering': '#f59e0b',
      'Business': '#8b5cf6',
      'Education': '#ef4444',
      'Construction': '#f97316',
      'Hospitality': '#ec4899',
      'Finance': '#06b6d4',
      'Sales': '#84cc16',
      'Marketing': '#f43f5e'
    };
    return colors[field] || '#6b7280';
  };

  return (
    <div className="job-detail-container">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/jobs" className="breadcrumb-link">
          All Jobs
        </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Job Details</span>
        </nav>

        <div className="job-detail-card">
          {/* Job Header */}
          <div className="job-header">
            <div className="job-main-info">
              <div className="job-tags">
                <span 
                  className="field-tag"
                  style={{ '--field-color': getFieldColor(job.field) }}
                >
                  {job.field}
                </span>
                {job.featured && (
                  <span className="featured-tag">
                    ⭐ Featured
                  </span>
                )}
              </div>
              
              <h1 className="job-title">{job.title}</h1>
              <div className="job-company">{job.employer}</div>
              
              <div className="job-meta-grid">
                <div className="meta-item">
                  <span className="meta-icon">💰</span>
                  <div className="meta-content">
                    <div className="meta-label">Salary</div>
                    <div className="meta-value salary">{formatSalary(job.pay)}</div>
                  </div>
                </div>
                
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <div className="meta-content">
                    <div className="meta-label">Location</div>
                    <div className="meta-value">{job.location}</div>
                  </div>
                </div>
                
                <div className="meta-item">
                  <span className="meta-icon">🕒</span>
                  <div className="meta-content">
                    <div className="meta-label">Type</div>
                    <div className="meta-value">{job.type || 'Full-time'}</div>
                  </div>
                </div>
                
                {job.published_at && (
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <div className="meta-content">
                      <div className="meta-label">Posted</div>
                      <div className="meta-value">
                        {new Date(job.published_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="job-actions">
              <Link href={`/candidate/apply/${job._id}`} className="btn btn-primary">
              Apply
            </Link>
              
              <button className="save-button">
                <span className="button-icon">❤️</span>
                Save Job
              </button>
              
              <button className="share-button">
                <span className="button-icon">📤</span>
                Share
              </button>
            </div>
          </div>

          {/* Job Content */}
          <div className="job-content">
            <div className="content-main">
              <section className="description-section">
                <h2 className="section-title">
                  <span className="section-icon">📝</span>
                  Job Description
                </h2>
                <div className="description-content">
                  {job.description ? (
                    <div className="prose">
                      {job.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="no-content">
                      No detailed description provided by the employer.
                    </div>
                  )}
                </div>
              </section>

              {job.requirements && (
                <section className="requirements-section">
                  <h2 className="section-title">
                    <span className="section-icon">✅</span>
                    Requirements
                  </h2>
                  <div className="requirements-content">
                    <div className="prose">
                      {job.requirements.split('\n').map((requirement, index) => (
                        <p key={index}>{requirement}</p>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {job.benefits && (
                <section className="benefits-section">
                  <h2 className="section-title">
                    <span className="section-icon">🎁</span>
                    Benefits
                  </h2>
                  <div className="benefits-content">
                    <div className="prose">
                      {job.benefits.split('\n').map((benefit, index) => (
                        <p key={index}>{benefit}</p>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="content-sidebar">
              <div className="employer-card">
                <h3 className="sidebar-title">About the Employer</h3>
                <div className="employer-info">
                  <div className="employer-name">{job.employer}</div>
                  <div className="employer-meta">
                    <span className="employer-location">📍 {job.location}</span>
                  </div>
                </div>
                
                <div className="employer-actions">
                  <button className="btn btn-outline">
                    View Profile
                  </button>
                </div>
              </div>

              <div className="quick-actions">
                <h3 className="sidebar-title">Quick Actions</h3>
                <div className="action-buttons">
                  <Link href={`/candidate/apply/${job._id}`} className="btn btn-primary btn-full">
                  Apply for this Job
                </Link>
                  <button className="btn btn-secondary btn-full">
                    Save for Later
                  </button>
                  <button className="btn btn-outline btn-full">
                    Share with Friends
                  </button>
                </div>
              </div>

              <div className="job-alert">
                <h3 className="sidebar-title">Get Job Alerts</h3>
                <p>Receive similar jobs in your inbox</p>
                <button className="btn btn-outline btn-full">
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .job-detail-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Breadcrumb */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .breadcrumb-link {
          color: #dc2626;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: #b91c1c;
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: #d1d5db;
        }

        .breadcrumb-current {
          color: #374151;
          font-weight: 500;
        }

        /* Main Card */
        .job-detail-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        /* Job Header */
        .job-header {
          padding: 3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: start;
        }

        .job-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .field-tag {
          background: var(--field-color, #6b7280);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .featured-tag {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .job-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .job-company {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .job-meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .meta-icon {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .meta-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-size: 0.875rem;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-weight: 600;
          font-size: 1.125rem;
        }

        .meta-value.salary {
          color: #ffd700;
          font-weight: 700;
        }

        .job-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 200px;
        }

        .apply-button, .save-button, .share-button {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .apply-button {
          background: linear-gradient(135deg, #ffd700, #ffa500);
          color: #1e293b;
        }

        .apply-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
        }

        .save-button, .share-button {
          background: rgba(255,255,255,0.1);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }

        .save-button:hover, .share-button:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }

        /* Job Content */
        .job-content {
          padding: 3rem;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .content-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .section-icon {
          font-size: 1.5rem;
        }

        .description-content, .requirements-content, .benefits-content {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid #dc2626;
        }

        .prose {
          color: #374151;
          line-height: 1.7;
        }

        .prose p {
          margin-bottom: 1rem;
        }

        .prose p:last-child {
          margin-bottom: 0;
        }

        .no-content {
          color: #6b7280;
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }

        /* Sidebar */
        .content-sidebar {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .employer-card, .quick-actions, .job-alert {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .sidebar-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .employer-info {
          margin-bottom: 1.5rem;
        }

        .employer-name {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .employer-location {
          font-size: 0.875rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .employer-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: 1px solid #dc2626;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .btn-secondary {
          background: #374151;
          color: white;
          border: 1px solid #374151;
        }

        .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn-full {
          width: 100%;
        }

        .job-alert p {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        /* States */
        .error-state, .loading-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-state h2, .loading-state p {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .error-state p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #dc2626;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .job-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .content-sidebar {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .job-header {
            grid-template-columns: 1fr;
            padding: 2rem;
          }

          .job-content {
            padding: 2rem;
          }

          .job-title {
            font-size: 2rem;
          }

          .job-meta-grid {
            grid-template-columns: 1fr;
          }

          .job-actions {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .apply-button, .save-button, .share-button {
            flex: 1;
            min-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 0.5rem;
          }

          .job-header, .job-content {
            padding: 1.5rem;
          }

          .job-title {
            font-size: 1.75rem;
          }

          .job-actions {
            flex-direction: column;
          }

          .apply-button, .save-button, .share-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}