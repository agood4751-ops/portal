// pages/candidate/dashboard.js
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Notification from '../../components/Notification';

export default function CandidateDashboard() {
  const router = useRouter();
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);
  const lastStatusesRef = useRef({});

  async function fetchApps() {
    setLoading(true);
    try {
      const res = await fetch('/api/applications/mine', { credentials: 'same-origin' });
      if (!res.ok) {
        const body = await res.json().catch(()=>({}));
        throw new Error(body.error || `Failed (${res.status})`);
      }
      const data = await res.json();
      const newApps = data.applications || [];
      // detect status changes
      const changed = [];
      newApps.forEach(a => {
        const prev = lastStatusesRef.current[a._id];
        if (prev && prev !== a.status) {
          changed.push({ id: a._id, title: a.jobTitle || 'Job', old: prev, now: a.status });
        }
        lastStatusesRef.current[a._id] = a.status;
      });

      if (changed.length) {
        const c = changed[0];
        setNotif({ type: 'success', message: `Status updated for "${c.title}": ${c.old} → ${c.now}` });
      }

      setApps(newApps);
    } catch (err) {
      console.error('Failed to load applications', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial fetch
    fetchApps();
    // poll every 15s
    const t = setInterval(fetchApps, 15000);
    return () => clearInterval(t);
  }, []);

  // show one-time success message if redirected with ?application=success
  useEffect(() => {
    if (!router || !router.query) return;
    if (router.query.application === 'success') {
      setNotif({ type: 'success', message: 'Application submitted successfully.' });
      const q = { ...router.query }; delete q.application;
      router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true });
    }
  }, [router.query]);

  const refresh = () => fetchApps();

  return (
    <div style={{padding:'2rem', maxWidth:1100, margin:'0 auto'}}>
      <Notification type={notif?.type} message={notif?.message} onClose={() => setNotif(null)} />

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <h1 style={{margin:0}}>My Applications</h1>
        <div>
          <button onClick={refresh} style={{background:'#111827', color:'#fff', border:'none', padding:'8px 12px', borderRadius:8, cursor:'pointer'}}>Refresh</button>
        </div>
      </div>

      {loading && <div style={{padding:20, background:'#fff', borderRadius:12}}>Loading your applications…</div>}
      {!loading && error && <div style={{padding:12, background:'#fff1f2', borderRadius:8, color:'#9f1239'}}>{error}</div>}
      {!loading && !error && apps && apps.length === 0 && <div>No applications found.</div>}
      {!loading && !error && apps && apps.length > 0 && (
        <div style={{display:'grid', gap:12}}>
          {apps.map(app => (
            <div key={app._id} style={{padding:16, background:'#fff', borderRadius:10, display:'flex', justifyContent:'space-between', gap:12, alignItems:'flex-start', boxShadow:'0 6px 18px rgba(2,6,23,0.06)'}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:800}}>{app.jobTitle || 'Untitled role'}</div>
                <div style={{color:'#374151', marginTop:6}}>{app.jobEmployer}</div>
                <div style={{color:'#6b7280', marginTop:6}}>Applied: {new Date(app.createdAt).toLocaleString()}</div>
                <div style={{marginTop:10}}>
                  <strong>Status:</strong> {app.status || 'Applied'}
                </div>
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
