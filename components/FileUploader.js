// components/FileUploader.js
import { useState } from 'react';

/**
 * FileUploader
 * Props:
 *  - onUploaded(files) => callback with array of { id, filename, originalName, field }
 *  - fieldName (string) optional, default 'files'
 *  - multiple (bool) optional
 */
export default function FileUploader({ onUploaded, fieldName = 'files', multiple = true }) {
  const [selected, setSelected] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    setUploading(true);

    try {
      const form = new FormData();
      for (const f of files) {
        form.append(fieldName, f, f.name);
      }

      const res = await fetch('/api/candidate/upload', {
        method: 'POST',
        body: form,
        credentials: 'same-origin'
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Upload failed');
        setUploading(false);
        return;
      }

      // body.files => array of { id, filename, originalName, field }
      setSelected(body.files || []);
      onUploaded && onUploaded(body.files || []);
    } catch (err) {
      console.error('Upload error', err);
      setError('Upload failed (network)');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label style={{display:'block', fontWeight:600, marginBottom:6}}>Upload documents</label>
      <input type="file" multiple={multiple} onChange={handleFilesChange} />
      {uploading && <div style={{marginTop:8}}>Uploading…</div>}
      {error && <div style={{color:'#b91c1c', marginTop:8}}>{error}</div>}

      {selected.length > 0 && (
        <div style={{marginTop:8}}>
          <div style={{fontSize:13, color:'#374151'}}>Uploaded files:</div>
          <ul style={{marginTop:6}}>
            {selected.map(f => (
              <li key={f.id}>
                <a href={`/api/file/${f.id}`} target="_blank" rel="noreferrer" style={{color:'#4f46e5', textDecoration:'underline'}}>
                  {f.originalName || f.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
