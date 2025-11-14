// lib/uploadClient.js
export async function uploadFilesByField(filesByField) {
  const form = new FormData();
  for (const fieldName of Object.keys(filesByField)) {
    const list = filesByField[fieldName] || [];
    for (const f of list) form.append(fieldName, f, f.name);
  }

  const res = await fetch('/api/candidate/upload', {
    method: 'POST',
    body: form,
    credentials: 'same-origin'
  });

  const body = await res.json().catch(()=>({}));
  if (!res.ok) throw body || new Error(`Upload failed (${res.status})`);
  return body.files || [];
}
