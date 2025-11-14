// pages/candidate/dashboard.js
import useSWR from 'swr';
import Link from 'next/link';
import { useState } from 'react';

const fetcher = (u) => fetch(u).then(r => r.json());

function StatusBadge({ status }) {
  const map = {
    Applied: 'bg-gray-100 text-gray-700',
    'In Review': 'bg-yellow-100 text-yellow-800',
    Interview: 'bg-blue-100 text-blue-800',
    Hired: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800'
  };
  return <span className={`px-3 py-1 rounded-full text-sm ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

export default function Dashboard() {
  const { data, error, mutate } = useSWR('/api/applications/mine', fetcher, { fallbackData: { applications: [] } });
  const [filter, setFilter] = useState('');

  if (error) return <div className="job-card">Failed to load applications.</div>;

  const apps = (data?.applications || []).filter(a => (filter ? a.status === filter : true));

  return (
    <div className="container">
      <h2 style={{fontSize:22, fontWeight:800, color:'var(--accent-1)'}}>My Applications</h2>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, marginBottom:12}}>
        <div style={{display:'flex', gap:8}}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input" style={{padding:'8px 12px', minWidth:160}}>
            <option value="">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="In Review">In Review</option>
            <option value="Interview">Interview</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={() => mutate()} className="btn btn-ghost">Refresh</button>
        </div>
        <div style={{color:'var(--muted)'}}>{apps.length} applications</div>
      </div>

      <div className="grid" style={{marginTop:6}}>
        {apps.length === 0 && <div className="job-card">You have not applied to any jobs yet. Browse jobs and apply.</div>}

        {apps.map(a => (
          <div key={a._id} className="job-card" style={{display:'flex', justifyContent:'space-between', gap:12}}>
            <div>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                <div style={{fontSize:18, fontWeight:700}}>{a.jobTitle || a.jobId}</div>
                <StatusBadge status={a.status} />
              </div>
              <div className="job-meta" style={{marginTop:6}}>{a.name} • {a.email}</div>
              <div style={{marginTop:8, color:'var(--muted)'}}>{a.message ? a.message.slice(0,160) : '—'}</div>

              {a.files?.length > 0 && (
                <div style={{marginTop:10}}>
                  <div className="text-sm" style={{color:'var(--muted)'}}>Documents</div>
                  <ul style={{marginTop:6, marginLeft:16}}>
                    {a.files.map(f => (
                      <li key={f.id}><a href={`/api/file/${f.id}`} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{f.originalName || f.filename}</a> <span style={{color:'var(--muted)', fontSize:12}}>({f.field})</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{textAlign:'right', minWidth:140}}>
              <div style={{color:'var(--muted)'}}>{new Date(a.createdAt).toLocaleDateString()}</div>
              <div style={{marginTop:10, display:'flex', flexDirection:'column', gap:8}}>
                <Link href={`/jobs/${a.jobId}`} className="btn btn-ghost" aria-label="View Job" style={{textAlign:'center'}}>
                  View Job
                </Link>
                <Link href={`/candidate/apply/${a.jobId}`} className="btn btn-primary" aria-label="Apply Again" style={{textAlign:'center'}}>
                  Apply Again
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
