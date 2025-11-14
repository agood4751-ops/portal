// pages/admin/dashboard.js
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (u) => fetch(u).then(r => r.json());

export default function AdminDashboard() {
  const { data } = useSWR('/api/admin/stats', fetcher, { fallbackData: {} });

  const stats = {
    newApplications: data.newApplications || 0,
    totalJobs: data.totalJobs || 0,
    totalCandidates: data.totalCandidates || 0
  };

  return (
    <div className="container">
      <h2 style={{fontSize:22, fontWeight:800, color:'var(--accent-1)'}}>Admin dashboard</h2>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:12, marginTop:12}}>
        <div className="job-card">
          <div style={{fontSize:13, color:'var(--muted)'}}>New applications</div>
          <div style={{fontSize:20, fontWeight:800}}>{stats.newApplications}</div>
          <div style={{marginTop:8}}>
            <Link href="/admin/applications" className="btn btn-ghost">
              View applications
            </Link>
          </div>
        </div>

        <div className="job-card">
          <div style={{fontSize:13, color:'var(--muted)'}}>Total jobs</div>
          <div style={{fontSize:20, fontWeight:800}}>{stats.totalJobs}</div>
          <div style={{marginTop:8}}>
            <Link href="/admin/jobs" className="btn btn-ghost">
              Manage jobs
            </Link>
          </div>
        </div>

        <div className="job-card">
          <div style={{fontSize:13, color:'var(--muted)'}}>Total candidates</div>
          <div style={{fontSize:20, fontWeight:800}}>{stats.totalCandidates}</div>
          <div style={{marginTop:8}}>
            <Link href="/admin/candidates" className="btn btn-ghost">
              View candidates
            </Link>
          </div>
        </div>
      </div>

      <div style={{marginTop:18}}>
        <h3 style={{fontSize:18, fontWeight:700}}>Recent applications</h3>
        <RecentApplications />
      </div>
    </div>
  );
}

function RecentApplications() {
  const { data } = useSWR('/api/admin/applications?recent=1&limit=6', (u) => fetch(u).then(r => r.json()), { fallbackData: { applications: [] } });
  const apps = data.applications || [];

  return (
    <div style={{marginTop:12, display:'grid', gap:10}}>
      {apps.length === 0 && <div className="job-card">No recent applications.</div>}
      {apps.map(a => (
        <div key={a._id} className="job-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700}}>{a.jobTitle || 'Job'}</div>
            <div style={{color:'var(--muted)'}}>{a.name} • {a.email}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{color:'var(--muted)', fontSize:13}}>{new Date(a.createdAt).toLocaleDateString()}</div>
            <div style={{marginTop:8}}>
              <Link href={`/admin/applications/${a._id}`} className="btn btn-primary">
                Open
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
