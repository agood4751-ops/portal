// pages/admin/jobs/[id].js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState, useEffect } from 'react';

const fetcher = u => fetch(u).then(r=>r.json());

export default function EditJobPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate } = useSWR(() => id ? `/api/admin/jobs/${id}` : null, fetcher);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data && data.job) setForm(data.job);
  }, [data]);

  if (!data) return <div>Loading…</div>;
  if (!form) return <div>Loading job…</div>;

  function update(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  async function save() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      });
      const body = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(body.error || 'Update failed');
      await mutate();
      router.push('/admin/jobs');
    } catch (err) {
      setError(err.message || 'Network error');
    } finally { setLoading(false); }
  }

  async function remove() {
    if (!confirm('Delete this job permanently?')) return;
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin/jobs');
    } catch (err) {
      alert('Delete failed: ' + (err.message || ''));
    }
  }

  return (
    <div className="container">
      <h2 style={{fontSize:22,fontWeight:800}}>Edit job</h2>

      <div style={{marginTop:12, display:'grid', gap:12, maxWidth:900}}>
        {error && <div className="error-message">{error}</div>}

        <input className="input" value={form.title||''} onChange={e=>update('title', e.target.value)} placeholder="Job title" />
        <input className="input" value={form.employer||''} onChange={e=>update('employer', e.target.value)} placeholder="Employer" />
        <input className="input" value={form.field||''} onChange={e=>update('field', e.target.value)} placeholder="Field" />
        <input className="input" value={form.salary||''} onChange={e=>update('salary', e.target.value)} placeholder="Salary" />
        <input className="input" value={form.type||''} onChange={e=>update('type', e.target.value)} placeholder="Type" />
        <input className="input" value={form.location||''} onChange={e=>update('location', e.target.value)} placeholder="Location" />
        <textarea className="input" value={form.description||''} onChange={e=>update('description', e.target.value)} rows={8} />

        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="checkbox" checked={!!form.featured} onChange={e=>update('featured', e.target.checked)} />
          <strong>Featured</strong>
        </label>

        <div style={{display:'flex', gap:8}}>
          <button onClick={save} className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
          <button onClick={()=>router.push('/admin/jobs')} className="btn btn-ghost">Back</button>
          <button onClick={remove} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}
