// pages/candidate/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Notification from '../../components/Notification';

export default function CandidateDashboard() {
  const router = useRouter();
  const { query } = router;

  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);

  // show notification if ?application=success (or other messages)
  useEffect(() => {
    if (!query) return;
    if (query.application === 'success') {
      setNotif({ type: 'success', message: 'Application submitted successfully.' });
      // remove the query param without reloading (clean URL)
      const q = { ...query };
      delete q.application;
      router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
    }
    if (query.application === 'failed') {
      setNotif({ type: 'error', message: 'Application submission failed. See details in the dashboard.' });
      const q = { ...query }; delete q.application;
      router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
    }
  }, [query]);

  // fetch candidate's applications
  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/applications/mine', { credentials: 'same-origin' });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body.error || `Failed (${res.status})`);
      }
      const data = await res.json();
      setApps(data.applications || []);
    } catch (err) {
      console.error('Failed to load applications', err);
      setError(err.message || 'Failed to load applications');
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // helper to refresh (call after actions)
  const refresh = () => fetchApps();

  return (
    <div style={{padding:'2rem', maxWidth:1100, margin:'0 auto'}}>
      <Notification
        type={notif?.type}
        message={notif?.message}
        onClose={() => setNotif(null)}
      />

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <h1 style={{margin:0}}>My Applications</h1>
        <div>
          <button onClick={refresh} style={{
            background:'#111827', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, cursor:'pointer'
          }}>Refresh</button>
        </div>
      </div>

      {loading && <div style={{padding:20, background:'#fff', borderRadius:12, boxShadow:'0 6px 18px rgba(2,6,23,0.06)'}}>Loading your applications…</div>}

      {!loading && error && <div style={{padding:12, background:'#fff1f2', borderRadius:8, color:'#9f1239'}}>{error}</div>}

      {!loading && !error && apps && apps.length === 0 && (
        <div style={{padding:20, background:'#fff', borderRadius:12}}>No applications found. Apply to a job to see it here.</div>
      )}

      {!loading && !error && apps && apps.length > 0 && (
        <div style={{display:'grid', gap:12}}>
          {apps.map(app => (
            <div key={app._id} style={{padding:16, background:'#fff', borderRadius:10, boxShadow:'0 6px 18px rgba(2,6,23,0.06)', display:'flex', justifyContent:'space-between', gap:12, alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:800, fontSize:16}}>{app.jobTitle || 'Untitled role'}</div>
                <div style={{color:'#374151', marginTop:6}}>{app.jobEmployer}</div>
                <div style={{color:'#6b7280', marginTop:6}}>Applied: {new Date(app.createdAt).toLocaleString()}</div>

                <div style={{marginTop:10, display:'flex', gap:8, flexWrap:'wrap'}}>
                  <div style={{padding:'6px 10px', background:'#eef2ff', borderRadius:6, fontWeight:700, color:'#1e3a8a'}}>{app.status || 'Applied'}</div>
                  {app.feeStatus && <div style={{padding:'6px 10px', background:'#fefce8', borderRadius:6}}>{app.feeStatus}</div>}
                </div>

                {app.files && app.files.length > 0 && (
                  <div style={{marginTop:10}}>
                    <div style={{fontWeight:700, marginBottom:6}}>Documents</div>
                    <ul>
                      {app.files.map(f => (
                        <li key={f.id || f._id}>
                          <a href={`/api/file/${f.id || f._id}`} target="_blank" rel="noreferrer">{f.originalName || f.filename || 'Document'}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {app.notes && app.notes.length > 0 && (
                  <div style={{marginTop:8, fontSize:13, color:'#6b7280'}}>
                    <strong>Admin notes:</strong> {app.notes.map(n => n.note).join(' — ')}
                  </div>
                )}
              </div>

              <div style={{minWidth:140, textAlign:'right'}}>
                <button onClick={() => router.push(`/jobs/${app.jobId}`)} style={{background:'transparent', border:'1px solid #d1d5db', padding:'8px 12px', borderRadius:8, cursor:'pointer'}}>View job</button>
                <div style={{height:8}} />
                <button onClick={() => router.push(`/candidate/application/${app._id}`)} style={{background:'#111827', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, cursor:'pointer'}}>View application</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
