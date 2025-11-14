// pages/candidate/profile.js
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (u) => fetch(u).then(r => r.json());

export default function ProfilePage() {
  const { data, mutate } = useSWR('/api/candidate/profile', fetcher);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [permitFile, setPermitFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data?.profile) {
      setForm({ name: data.profile.name || '', email: data.profile.email || '', phone: data.profile.phone || '' });
    }
  }, [data]);

  async function saveProfile(e) {
    e?.preventDefault();
    const res = await fetch('/api/candidate/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const body = await res.json();
    if (!res.ok) return alert(body.error || 'Save failed');
    setEditing(false);
    mutate();
  }

  async function uploadDoc(file, fieldName) {
    if (!file) return null;
    if (file.size > Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || 5242880)) {
      alert('File too large');
      return null;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('field', fieldName);
    const res = await fetch('/api/candidate/upload', { method: 'POST', body: fd });
    const body = await res.json();
    if (!res.ok) {
      alert(body.error || 'Upload failed');
      return null;
    }
    return body.fileId;
  }

  async function handleUploadAll(e) {
    e?.preventDefault();
    setUploading(true);
    try {
      const updates = {};
      if (resumeFile) {
        const id = await uploadDoc(resumeFile, 'resume');
        if (id) updates.resume = id;
      }
      if (passportFile) {
        const id = await uploadDoc(passportFile, 'passport');
        if (id) updates.passport = id;
      }
      if (permitFile) {
        const id = await uploadDoc(permitFile, 'permit');
        if (id) updates.permit = id;
      }
      // Optionally send profile modifications with file ids
      if (Object.keys(updates).length) {
        await fetch('/api/candidate/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
      }
      alert('Files uploaded');
      setResumeFile(null); setPassportFile(null); setPermitFile(null);
      mutate();
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      {!data && <div>Loading...</div>}

      {data && (
        <div className="bg-white rounded shadow p-4 space-y-4">
          {!editing ? (
            <>
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{data.profile?.name || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{data.profile?.email || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{data.profile?.phone || '-'}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500">Uploaded documents</div>
                <ul className="list-disc ml-6">
                  {data.profile?.files?.length ? data.profile.files.map(f => (
                    <li key={f.id}>
                      <a href={`/api/file/${f.id}`} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{f.originalName || f.filename}</a> <span className="text-xs text-gray-400">({f.field})</span>
                    </li>
                  )) : <li className="text-gray-500">No documents uploaded</li>}
                </ul>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setEditing(true)} className="px-3 py-1 bg-indigo-600 text-white rounded">Edit profile</button>
                <label className="px-3 py-1 border rounded cursor-pointer">
                  <input type="file" className="hidden" onChange={e => setResumeFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
                  Upload resume
                </label>
                <button onClick={handleUploadAll} className="px-3 py-1 border rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload selected files'}</button>
              </div>
            </>
          ) : (
            <form onSubmit={saveProfile} className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Full name</label>
                <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
                <button onClick={() => setEditing(false)} type="button" className="px-3 py-1 border rounded">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Upload documents (optional)</h3>
        <div className="bg-white p-4 rounded shadow space-y-3">
          <div>
            <label className="block text-sm">Resume (PDF/DOC)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
            {resumeFile && <div className="text-xs text-gray-600">{resumeFile.name}</div>}
          </div>
          <div>
            <label className="block text-sm">Passport (PDF/PNG/JPG)</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setPassportFile(e.target.files[0])} />
            {passportFile && <div className="text-xs text-gray-600">{passportFile.name}</div>}
          </div>
          <div>
            <label className="block text-sm">Work permit (PDF/PNG/JPG)</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setPermitFile(e.target.files[0])} />
            {permitFile && <div className="text-xs text-gray-600">{permitFile.name}</div>}
          </div>
          <div className="flex gap-2">
            <button onClick={handleUploadAll} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload documents'}
            </button>
          </div>
          <div className="text-xs text-gray-500">Max file size: {(Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || 5242880) / 1024 / 1024).toFixed(1)} MB</div>
        </div>
      </div>

    </div>
  );
}
