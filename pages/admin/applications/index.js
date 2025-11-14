// pages/admin/applications/index.js
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (u) => fetch(u).then(r => r.json());

export default function AdminApplications() {
  const [filter, setFilter] = useState({ status: '', q: '' });
  const qs = new URLSearchParams();
  if (filter.status) qs.set('status', filter.status);
  if (filter.q) qs.set('q', filter.q);

  const { data, mutate } = useSWR(`/api/admin/applications?${qs.toString()}`, fetcher, { fallbackData: { applications: [] }});
  const apps = data.applications || [];

  async function changeStatus(id, status) {
    await fetch(`/api/admin/applications/${id}/status`, { method:'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    mutate();
  }

  return (
    <div className="container">
      <h2 style={{fontSize:22,fontWeight:800,color:'var(--accent-1)'}}>Applications</h2>

      <div style={{display:'flex', gap:8, marginTop:12, marginBottom:12, alignItems:'center'}}>
        <input placeholder="Search name, email or job" value={filter.q} onChange={(e) => setFilter({...filter, q: e.target.value})} className="input" />
        <select value={filter.status} onChange={(e)=>setFilter({...filter, status:e.target.value})} className="input" style={{minWidth:160}}>
          <option value="">All status</option>
          <option value="Applied">Applied</option>
          <option value="In Review">In Review</option>
          <option value="Interview">Interview</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onClick={() => mutate()} className="btn btn-ghost">Refresh</button>
      </div>

      <div style={{display:'grid', gap:10}}>
        {apps.length === 0 && <div className="job-card">No applications found.</div>}
        {apps.map(app => (
          <div key={app._id} className="job-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:700}}>{app.jobTitle || 'Job'}</div>
              <div style={{color:'var(--muted)'}}>{app.name} • {app.email}</div>
              <div style={{color:'var(--muted)', fontSize:13}}>Applied: {new Date(app.createdAt).toLocaleString()}</div>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end'}}>
              <select defaultValue={app.status} onChange={(e) => changeStatus(app._id, e.target.value)} className="input" style={{padding:'6px 8px'}}>
                <option value="Applied">Applied</option>
                <option value="In Review">In Review</option>
                <option value="Interview">Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div style={{display:'flex', gap:8}}>
                <Link href={`/admin/applications/${app._id}`}><a className="btn btn-primary">Open</a></Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
