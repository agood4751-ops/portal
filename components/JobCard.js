// components/JobCard.js
import Link from 'next/link';

export default function JobCard({ job }) {
  // Format salary display
  const formatSalary = (pay) => {
    if (!pay || pay === 'Salary not specified') return 'Salary not specified';
    return pay;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
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
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-main-info">
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.employer}</div>
          <div className="job-meta">
            <span className="job-location">📍 {job.location}</span>
          </div>
        </div>
        
        <div className="job-date">
          {formatDate(job.published_at)}
        </div>
      </div>

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

      <div className="job-salary">
        {formatSalary(job.pay)}
      </div>

      <div className="job-card-footer">
        <div className="job-type">
          <span className="job-type-badge">
            {job.type || 'Full-time'}
          </span>
        </div>
        <Link href={`/jobs/${job._id}`}>
          <button className="view-job-btn">
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="btn-icon">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </Link>
      </div>

      <style jsx>{`
        .job-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }

        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: #d1d5db;
        }

        .job-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .job-card:hover::before {
          transform: scaleX(1);
        }

        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .job-main-info {
          flex: 1;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.3;
          margin-bottom: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .job-company {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .job-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .job-location {
          font-size: 0.875rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .job-date {
          font-size: 0.75rem;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          white-space: nowrap;
        }

        .job-tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .field-tag {
          background: var(--field-color, #6b7280);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .featured-tag {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .job-salary {
          font-size: 1.125rem;
          font-weight: 700;
          color: #059669;
          margin-bottom: 1.5rem;
          background: #ecfdf5;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border-left: 4px solid #10b981;
        }

        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .job-type-badge {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid #dbeafe;
        }

        .view-job-btn {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .view-job-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
          background: linear-gradient(135deg, #b91c1c, #991b1b);
        }

        .btn-icon {
          transition: transform 0.3s ease;
        }

        .view-job-btn:hover .btn-icon {
          transform: translateX(2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .job-card {
            padding: 1.25rem;
          }

          .job-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .job-date {
            align-self: flex-start;
          }

          .job-card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .job-type {
            text-align: center;
          }

          .view-job-btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .job-card {
            padding: 1rem;
          }

          .job-title {
            font-size: 1.125rem;
          }

          .job-salary {
            font-size: 1rem;
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}