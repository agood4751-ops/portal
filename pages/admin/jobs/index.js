// pages/admin/jobs/index.js
import useSWR from 'swr';
import Link from 'next/link';
import { useState } from 'react';

const fetcher = (u) => fetch(u).then(r => r.json());

export default function AdminJobs() {
  const { data, mutate } = useSWR('/api/admin/jobs', fetcher, { fallbackData: { jobs: [] } });
  const jobs = data.jobs || [];
  const [deleting, setDeleting] = useState(null);

  async function removeJob(id) {
    if (!confirm('Delete this job? This action cannot be undone.')) return;
    try {
      setDeleting(id);
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      await mutate();
    } catch (err) {
      alert('Delete failed: ' + (err.message || ''));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
        <h2 style={{fontSize:22,fontWeight:800,color:'var(--accent-1)'}}>Manage Jobs</h2>
        <Link href="/admin/jobs/new" className="btn btn-primary">Create new job</Link>
      </div>

      <div style={{marginTop:16, display:'grid', gap:12}}>
        {jobs.length === 0 && <div className="job-card">No jobs yet.</div>}
        {jobs.map(job => (
          <div key={job._id} className="job-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:700}}>{job.title}</div>
              <div style={{color:'var(--muted)'}}>{job.employer || '—'} • {job.location || '—'}</div>
              {job.salary && <div style={{color:'var(--muted)'}}>{job.salary}</div>}
            </div>

            <div style={{display:'flex', gap:8}}>
              <Link href={`/admin/jobs/${job._id}`} className="btn btn-ghost">Edit</Link>
              <button onClick={() => removeJob(job._id)} className="btn btn-danger" disabled={deleting===job._id}>
                {deleting===job._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
