// pages/admin/jobs/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    employer: '',
    field: '',
    salary: '',
    type: '',
    location: '',
    description: '',
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Job title required');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const body = await res.json().catch(()=>({}));
      if (!res.ok) {
        throw new Error(body.error || 'Create failed');
      }
      router.push('/admin/jobs');
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2 style={{fontSize:22,fontWeight:800}}>Create new job</h2>

      <form onSubmit={submit} style={{marginTop:12, display:'grid', gap:12, maxWidth:900}}>
        {error && <div className="error-message">{error}</div>}

        <input className="input" placeholder="Job title" value={form.title} onChange={e=>update('title', e.target.value)} />
        <input className="input" placeholder="Employer" value={form.employer} onChange={e=>update('employer', e.target.value)} />
        <input className="input" placeholder="Field (e.g. Engineering)" value={form.field} onChange={e=>update('field', e.target.value)} />
        <input className="input" placeholder="Salary (e.g. $35 - $45 / Hour)" value={form.salary} onChange={e=>update('salary', e.target.value)} />
        <input className="input" placeholder="Type (Full-time / Part-time / Contract)" value={form.type} onChange={e=>update('type', e.target.value)} />
        <input className="input" placeholder="Location (City, Province)" value={form.location} onChange={e=>update('location', e.target.value)} />
        <textarea className="input" placeholder="Full job description" value={form.description} onChange={e=>update('description', e.target.value)} rows={8} />

        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="checkbox" checked={form.featured} onChange={e=>update('featured', e.target.checked)} />
          <strong>Featured</strong>
        </label>

        <div style={{display:'flex', gap:8}}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create job'}</button>
          <button type="button" className="btn btn-ghost" onClick={()=>router.push('/admin/jobs')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
