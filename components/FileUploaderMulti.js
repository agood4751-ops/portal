// components/FileUploaderMulti.js
import { useState, useEffect } from 'react';

export default function FileUploaderMulti({
  fieldName,
  label,
  accept = '',
  multiple = false,
  onChange,
  uploadedFiles = []
}) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    onChange && onChange(files);
  }, [files]);

  function handleChange(e) {
    const chosen = Array.from(e.target.files || []);
    setFiles(chosen);
  }

  function removeAt(i) {
    const copy = files.slice();
    copy.splice(i,1);
    setFiles(copy);
  }

  return (
    <div style={{marginBottom:12}}>
      <label style={{fontWeight:600}}>{label}</label>
      <div style={{marginTop:8}}>
        <input type="file" accept={accept} multiple={multiple} onChange={handleChange} />
      </div>

      {files.length > 0 && (
        <div style={{marginTop:8}}>
          <div style={{fontSize:13, color:'#374151'}}>To be uploaded:</div>
          <ul>
            {files.map((f, i) => (
              <li key={i} style={{display:'flex', gap:10, alignItems:'center', marginBottom:6}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{f.name}</div>
                  <div style={{fontSize:12, color:'#6b7280'}}>{(f.size/1024/1024).toFixed(2)} MB</div>
                </div>
                <button type="button" onClick={() => removeAt(i)} style={{background:'#ef4444', color:'#fff', border:'none', padding:'6px 8px', borderRadius:6}}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedFiles && uploadedFiles.length > 0 && (
        <div style={{marginTop:8}}>
          <div style={{fontSize:13, color:'#374151'}}>Already uploaded:</div>
          <ul>
            {uploadedFiles.filter(f => f.field === fieldName).map(u => (
              <li key={u.id}><a href={`/api/file/${u.id}`} target="_blank" rel="noreferrer">{u.originalName || u.filename}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
