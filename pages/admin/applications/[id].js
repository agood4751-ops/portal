// pages/admin/applications/[id].js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (u) => fetch(u).then((r) => r.json());

export default function ApplicationView() {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate } = useSWR(() => (id ? `/api/admin/applications/${id}` : null), fetcher);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  if (!data) return <div>Loading...</div>;
  const app = data.application;

  async function saveNote() {
    if (!note) return;
    await fetch(`/api/admin/applications/${id}/notes`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ note }) });
    setNote('');
    mutate();
  }

  async function updateStatus() {
    if (!status) return;
    await fetch(`/api/admin/applications/${id}/status`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    setStatus('');
    mutate();
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Application details</h2>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{app.jobTitle || app.jobId}</h3>
            <div className="text-sm text-gray-600">{app.name} • {app.email} • {app.phone || '—'}</div>
            <div className="text-sm text-gray-500 mt-1">Applied: {new Date(app.createdAt).toLocaleString()}</div>
            <div className="mt-3 text-gray-800">{app.message || ''}</div>
          </div>

          <div className="text-right">
            <div className="text-sm">Status: <strong>{app.status}</strong></div>
            <div className="mt-2">
              <select defaultValue={app.status} onChange={(e) => setStatus(e.target.value)} className="p-1 border rounded">
                <option value="">Change status</option>
                <option value="Applied">Applied</option>
                <option value="In Review">In Review</option>
                <option value="Interview">Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button onClick={updateStatus} className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h4 className="font-semibold mb-2">Uploaded files</h4>
          {app.files && app.files.length ? (
            <ul className="list-disc ml-6">
              {app.files.map(f => (
                <li key={f.id}>
                  <a href={`/api/file/${f.id}`} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{f.originalName || f.filename}</a>
                  <span className="text-xs text-gray-400 ml-2">({f.field})</span>
                </li>
              ))}
            </ul>
          ) : <div className="text-gray-600">No files uploaded</div>}
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-2">Notes</h4>
          <div className="space-y-2">
            {app.notes && app.notes.length ? app.notes.map(n => (
              <div key={n._id} className="p-2 border rounded">
                <div className="text-sm text-gray-600">{new Date(n.createdAt).toLocaleString()} • {n.adminName || 'Admin'}</div>
                <div>{n.note}</div>
              </div>
            )) : <div className="text-gray-600">No notes yet</div>}
          </div>

          <div className="mt-3 flex gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add internal note..." className="flex-1 p-2 border rounded" />
            <button onClick={saveNote} className="px-3 py-1 bg-green-600 text-white rounded">Add note</button>
          </div>
        </div>

      </div>
    </div>
  );
}
