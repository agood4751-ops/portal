// pages/candidate/profile.js
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';

const fetcher = (u) => fetch(u).then(r => r.json());

export default function ProfilePage() {
  const { data, mutate, isLoading } = useSWR('/api/candidate/profile', fetcher);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      setForm({ 
        name: data.profile.name || '', 
        email: data.profile.email || '', 
        phone: data.profile.phone || '' 
      });
    }
  }, [data]);

  async function saveProfile(e) {
    e?.preventDefault();
    const res = await fetch('/api/candidate/profile', { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(form) 
    });
    if (res.ok) {
      setEditing(false);
      mutate();
    } else {
      alert('Save failed');
    }
  }

  async function handleUpload(e) {
    if (!resumeFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', resumeFile);
    fd.append('field', 'resume');

    try {
      const res = await fetch('/api/candidate/upload', { method: 'POST', body: fd });
      if(res.ok) {
        const body = await res.json();
        // Link file to profile
        await fetch('/api/candidate/profile', { 
           method: 'PUT', 
           headers: {'Content-Type': 'application/json'}, 
           body: JSON.stringify({ resume: body.files[0].id }) 
        });
        setResumeFile(null);
        mutate();
        alert('Resume updated!');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  if (isLoading) return <div className="container">Loading profile...</div>;

  return (
    <div className="container">
      <h1 className="page-title">My Profile</h1>

      <div className="grid-layout">
        {/* Personal Info Card */}
        <div className="card">
          <div className="card-header">
            <h2>Personal Information</h2>
            {!editing && <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>}
          </div>

          {editing ? (
            <form onSubmit={saveProfile} className="edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
              </div>
              <div className="btn-row">
                <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="info-display">
               <div className="info-row">
                 <span className="label">Name</span>
                 <span className="value">{data.profile.name}</span>
               </div>
               <div className="info-row">
                 <span className="label">Email</span>
                 <span className="value">{data.profile.email}</span>
               </div>
               <div className="info-row">
                 <span className="label">Phone</span>
                 <span className="value">{data.profile.phone || 'Not provided'}</span>
               </div>
            </div>
          )}
        </div>

        {/* Documents Card */}
        <div className="card">
           <div className="card-header">
             <h2>Documents</h2>
           </div>
           
           <div className="doc-section">
             <h3>Resume</h3>
             <div className="file-list">
                {data.profile.files?.filter(f => f.field === 'resume').map(f => (
                    <a key={f.id} href={`/api/file/${f.id}`} target="_blank" className="file-link">
                        📄 {f.originalName}
                    </a>
                ))}
             </div>

             <div className="upload-zone">
                <input type="file" onChange={e => setResumeFile(e.target.files[0])} />
                <button onClick={handleUpload} disabled={!resumeFile || uploading} className="upload-btn">
                    {uploading ? 'Uploading...' : 'Upload New Resume'}
                </button>
             </div>
           </div>
        </div>
      </div>

      <style jsx>{`
        .container { max-width: 900px; margin: 0 auto; padding: 2rem; font-family: sans-serif; }
        .page-title { margin-bottom: 2rem; color: #1e293b; }
        
        .grid-layout { display: grid; gap: 2rem; }
        
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
        .card-header h2 { font-size: 1.25rem; margin: 0; color: #1e293b; }
        
        .edit-btn { color: #4f46e5; background: none; border: none; font-weight: 600; cursor: pointer; }
        
        /* Info Display */
        .info-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f8fafc; }
        .label { color: #64748b; }
        .value { font-weight: 500; color: #1e293b; }

        /* Forms */
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-size: 0.875rem; margin-bottom: 0.5rem; color: #64748b; }
        .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; }
        
        .btn-row { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
        .save-btn { background: #4f46e5; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; }
        .cancel-btn { background: white; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }

        /* Documents */
        .file-link { display: block; padding: 0.5rem; background: #f1f5f9; margin-bottom: 0.5rem; border-radius: 0.5rem; color: #4f46e5; text-decoration: none; }
        .upload-zone { margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center; }
        .upload-btn { background: #1e293b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; }
        .upload-btn:disabled { opacity: 0.5; }
      `}</style>
    </div>
  );
}