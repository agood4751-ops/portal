// pages/admin/candidates/index.js
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = u => fetch(u).then(r=>r.json());

export default function AdminCandidates() {
  const { data, mutate } = useSWR('/api/admin/candidates', fetcher, { fallbackData: { candidates: [] } });
  const candidates = (data && data.candidates) || [];

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{fontSize:22,fontWeight:800}}>Candidates</h2>
      </div>

      <div style={{marginTop:12, display:'grid', gap:10}}>
        {candidates.length === 0 && <div className="job-card">No candidates found.</div>}
        {candidates.map(c => (
          <div key={c._id} className="job-card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:800}}>{c.name || '—'}</div>
              <div style={{color:'var(--muted)'}}>{c.email || '—'} • {c.phone || '—'}</div>
              <div style={{color:'var(--muted)', fontSize:13}}>Joined: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</div>
            </div>

            <div style={{display:'flex', gap:8}}>
              <Link href={`/admin/candidates/${c._id}`} className="btn btn-primary">Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
