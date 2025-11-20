// pages/candidate/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Notification from '../../components/Notification';
import Link from 'next/link';

export default function CandidateDashboard() {
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    fetch('/api/applications/mine')
      .then(res => res.json())
      .then(data => {
        if (data.applications) setApps(data.applications);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Visual status colors
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('reject')) return 'bg-red-100 text-red-700';
    if (s.includes('hired') || s.includes('offer')) return 'bg-green-100 text-green-700';
    if (s.includes('interview')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-50 text-blue-700'; // Default (Applied/Pending)
  }

  return (
    <div className="dash-container">
      <Notification type={notif?.type} message={notif?.message} onClose={() => setNotif(null)} />
      
      <div className="header">
        <h1>My Applications</h1>
        <Link href="/jobs" className="new-app-btn">+ Apply to New Job</Link>
      </div>

      {loading ? (
         <div className="loading-state">
            {[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}
         </div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
            <div className="icon">📂</div>
            <h3>No applications yet</h3>
            <p>Start your career journey by applying to jobs today.</p>
            <Link href="/jobs" className="empty-btn">Browse Jobs</Link>
        </div>
      ) : (
        <div className="apps-grid">
          {apps.map(app => (
            <div key={app._id} className="app-card">
              <div className="card-main">
                <h2 className="job-title">{app.jobTitle || 'Unknown Role'}</h2>
                <div className="company-name">{app.jobEmployer || 'Unknown Company'}</div>
                <div className="meta-info">Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
              </div>
              
              <div className="card-status">
                <span className={`status-badge ${getStatusColor(app.status)}`}>
                    {app.status || 'Applied'}
                </span>
              </div>

              <div className="card-actions">
                <button onClick={() => router.push(`/candidate/application/${app._id}`)} className="view-btn">
                    View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .dash-container { max-width: 1000px; margin: 0 auto; padding: 2rem; font-family: sans-serif; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        h1 { font-size: 1.8rem; color: #1e293b; margin: 0; }
        
        .new-app-btn { 
            background: #1e293b; color: white; padding: 0.6rem 1.2rem; border-radius: 0.5rem; 
            text-decoration: none; font-size: 0.9rem; font-weight: 600; 
        }

        .apps-grid { display: grid; gap: 1rem; }
        .app-card { 
            background: white; padding: 1.5rem; border-radius: 1rem; border: 1px solid #e2e8f0;
            display: grid; grid-template-columns: 1fr auto auto; gap: 2rem; align-items: center;
            transition: 0.2s;
        }
        .app-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .job-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.25rem 0; }
        .company-name { font-size: 0.95rem; color: #64748b; }
        .meta-info { font-size: 0.8rem; color: #94a3b8; margin-top: 0.5rem; }

        .status-badge { padding: 0.35rem 0.85rem; border-radius: 99px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
        .bg-blue-50 { background: #eff6ff; color: #1d4ed8; }
        .bg-green-100 { background: #dcfce7; color: #15803d; }
        .bg-red-100 { background: #fee2e2; color: #b91c1c; }
        .bg-yellow-100 { background: #fef9c3; color: #a16207; }

        .view-btn { background: white; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: 500; color: #334155; transition: 0.2s; }
        .view-btn:hover { background: #f8fafc; border-color: #94a3b8; }

        /* Loading & Empty States */
        .skeleton-row { height: 80px; background: #f1f5f9; margin-bottom: 1rem; border-radius: 1rem; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .empty-state { text-align: center; padding: 4rem; background: #f8fafc; border-radius: 1rem; color: #64748b; }
        .empty-state .icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-btn { display: inline-block; margin-top: 1rem; color: #dc2626; font-weight: 600; text-decoration: none; }

        @media (max-width: 640px) {
            .app-card { grid-template-columns: 1fr; gap: 1rem; }
            .card-status { order: -1; }
            .card-actions { width: 100%; }
            .view-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}