// pages/candidate/application/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Notification from '../../../components/Notification';

export default function CandidateApplicationPage() {
  const router = useRouter();
  const { id } = router.query;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/applications/${id}`, { credentials: 'same-origin' })
      .then(async (res) => {
        if (res.status === 404) {
          throw { code: 404, message: 'Application not found' };
        }
        if (res.status === 403) {
          throw { code: 403, message: 'You are not allowed to view this application' };
        }
        if (!res.ok) {
          const body = await res.json().catch(()=>({}));
          throw { code: res.status, message: body.error || 'Failed to load' };
        }
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setApplication(data.application || null);
        }
      })
      .catch(err => {
        if (cancelled) return;
        console.error('Load application error', err);
        // if 404/403, show friendly notif then redirect back to dashboard
        if (err && (err.code === 404 || err.code === 403)) {
          setNotif({ type: 'error', message: err.message });
          setTimeout(() => router.replace('/candidate/dashboard'), 2200);
        } else {
          setError(err.message || 'Failed to load application');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div style={{padding:'2rem', maxWidth:900, margin:'0 auto'}}>Loading application…</div>
    );
  }

  if (error) {
    return (
      <div style={{padding:'2rem', maxWidth:900, margin:'0 auto'}}>
        <Notification type="error" message={error} onClose={() => setNotif(null)} />
        <div style={{padding:20, background:'#fff', borderRadius:8}}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/candidate/dashboard')} style={{marginTop:12}}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  if (!application) {
    // either not found -> Notification + redirect already scheduled in effect
    return (
      <div style={{padding:'2rem', maxWidth:900, margin:'0 auto'}}>
        <Notification type={notif?.type} message={notif?.message} onClose={() => setNotif(null)} />
        <div style={{padding:20, background:'#fff', borderRadius:8}}>No application to show.</div>
      </div>
    );
  }

  return (
    <div style={{padding:'2rem', maxWidth:900, margin:'0 auto'}}>
      <Notification type={notif?.type} message={notif?.message} onClose={() => setNotif(null)} />

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18}}>
        <div>
          <h1 style={{margin:0}}>{application.jobTitle || 'Application'}</h1>
          <div style={{color:'#6b7280'}}>{application.jobEmployer}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:800}}>{application.status || 'Applied'}</div>
          <div style={{color:'#6b7280', fontSize:13}}>{new Date(application.createdAt).toLocaleString()}</div>
        </div>
      </div>

      <div style={{padding:16, background:'#fff', borderRadius:10, boxShadow:'0 8px 30px rgba(2,6,23,0.06)'}}>
        <div style={{display:'grid', gap:12}}>
          <div>
            <strong>Candidate:</strong> {application.name || '—'} <br/>
            <strong>Email:</strong> {application.email || '—'} <br/>
            <strong>Phone:</strong> {application.phone || '—'}
          </div>

          <div>
            <strong>Message / Cover note</strong>
            <div style={{marginTop:8, padding:12, background:'#f8fafc', borderRadius:8, whiteSpace:'pre-wrap'}}>
              {application.message || '(none)'}
            </div>
          </div>

          <div>
            <strong>Files</strong>
            {(!application.files || application.files.length === 0) && <div style={{marginTop:8,color:'#6b7280'}}>No documents attached.</div>}
            {application.files && application.files.length > 0 && (
              <ul style={{marginTop:8}}>
                {application.files.map((f, i) => {
                  const fileId = f.id || f._id;
                  const name = f.originalName || f.filename || `Document ${i+1}`;
                  return (
                    <li key={fileId} style={{marginBottom:6}}>
                      <a href={`/api/file/${fileId}`} target="_blank" rel="noreferrer" style={{color:'#2563eb', textDecoration:'underline'}}>
                        {name}
                      </a>
                      <span style={{color:'#6b7280', marginLeft:8}}>{f.field ? `(${f.field})` : ''}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {application.notes && application.notes.length > 0 && (
            <div>
              <strong>Admin notes</strong>
              <ul style={{marginTop:8}}>
                {application.notes.map((n, i) => (
                  <li key={i}><strong>{n.adminName || 'Admin'}:</strong> {n.note} <em style={{color:'#6b7280', marginLeft:8}}>{new Date(n.createdAt).toLocaleString()}</em></li>
                ))}
              </ul>
            </div>
          )}

          <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:6}}>
            <button onClick={() => router.push('/candidate/dashboard')} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'transparent'}}>Back</button>
            <button onClick={() => router.push(`/jobs/${application.jobId}`)} style={{padding:'8px 12px', borderRadius:8, border:'none', background:'#111827', color:'#fff'}}>View Job</button>
          </div>
        </div>
      </div>
    </div>
  );
}
