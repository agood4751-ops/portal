// pages/candidate/apply/[jobId].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FileUploaderMulti from '../../../components/FileUploaderMulti';
import { uploadFilesByField } from '../../../lib/uploadClient';

export default function ApplyPage() {
  const router = useRouter();
  const { jobId } = router.query;
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  // client-side selected File objects per field
  const [resumeFilesClient, setResumeFilesClient] = useState([]);      // single file expected
  const [passportFilesClient, setPassportFilesClient] = useState([]);  // single file
  const [permitFilesClient, setPermitFilesClient] = useState([]);      // single file
  const [additionalFilesClient, setAdditionalFilesClient] = useState([]); // multiple

  // server-side saved file refs returned from /api/candidate/upload
  const [uploadedFileRefs, setUploadedFileRefs] = useState([]); // array of { id, filename, originalName, field }

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const MAX_BYTES = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || 5242880);
  const MAX_SIZE_MB = (MAX_BYTES / 1024 / 1024).toFixed(1);

  // Fetch job details
  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    fetch(`/api/jobs/${jobId}`)
      .then(res => res.ok ? res.json() : res.json().then(b => { throw b }))
      .then(data => { if (!cancelled) setJob(data.job); })
      .catch(err => {
        console.error('Failed to fetch job:', err);
        if (!cancelled) setErrors(prev => ({ ...prev, job: err.error || 'Failed to load job' }));
      });
    return () => { cancelled = true; };
  }, [jobId]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';

    // Check resume presence either already uploaded or selected
    const hasResumeRef = uploadedFileRefs.some(f => (f.field || '').toLowerCase().includes('resume') || (f.originalName || '').toLowerCase().includes('resume'));
    const hasResumeSelected = resumeFilesClient && resumeFilesClient.length > 0;
    if (!hasResumeRef && !hasResumeSelected) newErrors.resume = `Resume is required (upload up to ${MAX_SIZE_MB}MB)`;

    // check selected file sizes
    const allSelected = [
      ...(resumeFilesClient || []),
      ...(passportFilesClient || []),
      ...(permitFilesClient || []),
      ...(additionalFilesClient || [])
    ];
    for (const f of allSelected) {
      if (f && f.size && f.size > MAX_BYTES) {
        newErrors.files = `File ${f.name} exceeds maximum size of ${MAX_SIZE_MB}MB`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    if (!jobId) {
      setErrors({ submit: 'Missing job ID' });
      return;
    }

    setLoading(true);
    try {
      // 1) upload selected client files (if any)
      const filesByField = {};
      if (resumeFilesClient && resumeFilesClient.length) filesByField.resume = resumeFilesClient;
      if (passportFilesClient && passportFilesClient.length) filesByField.passport = passportFilesClient;
      if (permitFilesClient && permitFilesClient.length) filesByField.permit = permitFilesClient;
      if (additionalFilesClient && additionalFilesClient.length) filesByField.additional = additionalFilesClient;

      let uploaded = [];
      if (Object.keys(filesByField).length > 0) {
        uploaded = await uploadFilesByField(filesByField); // returns [{id, filename, originalName, field}, ...]
        setUploadedFileRefs(prev => prev.concat(uploaded));
      }

      // 2) combine file refs (previous + newly uploaded)
      const allFileRefs = (uploadedFileRefs || []).concat(uploaded || []);
      const filesPayload = allFileRefs.map(f => ({ id: f.id, field: f.field || 'documents', originalName: f.originalName || f.filename }));

      // 3) build application payload
      const payload = {
        jobId,
        message: form.message || '',
        files: filesPayload
      };
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.phone) payload.phone = form.phone;

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });

      const body = await res.json().catch(()=>({}));
      if (!res.ok) {
        setErrors({ submit: body.error || `Apply failed (status ${res.status})` });
        setLoading(false);
        return;
      }

      // success
      try { window.dispatchEvent(new Event('auth-change')); localStorage.setItem('auth-change', Date.now().toString()); } catch(e){}
      router.push('/candidate/dashboard?application=success');
    } catch (err) {
      console.error('Apply error', err);
      setErrors({ submit: err?.message || 'Network error or upload failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="apply-container">
      <div className="apply-content">
        <div className="apply-header">
          <button onClick={() => router.back()} className="back-button">← Back</button>
          <h1 className="apply-title">Apply for Position</h1>

          {job && (
            <div className="job-preview">
              <h2 className="job-title">{job.title}</h2>
              <div className="job-company">{job.employer}</div>
              <div className="job-location">📍 {job.location}</div>
            </div>
          )}
        </div>

        <div className="apply-form-container">
          <form onSubmit={submit} className="apply-form">
            {errors.submit && <div className="error-message global-error">{errors.submit}</div>}

            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`form-input ${errors.name ? 'error' : ''}`} />
                  {errors.name && <div className="field-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={`form-input ${errors.email ? 'error' : ''}`} />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number <span className="required">*</span></label>
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={`form-input ${errors.phone ? 'error' : ''}`} />
                  {errors.phone && <div className="field-error">{errors.phone}</div>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Documents</h3>
              {errors.files && <div className="error-message file-error">{errors.files}</div>}
              <div className="file-upload-grid">
                <FileUploaderMulti
                  label="Resume / CV (required)"
                  fieldName="resume"
                  accept=".pdf,.doc,.docx"
                  multiple={false}
                  onChange={setResumeFilesClient}
                  uploadedFiles={uploadedFileRefs}
                />

                <FileUploaderMulti
                  label="Passport Copy (optional)"
                  fieldName="passport"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple={false}
                  onChange={setPassportFilesClient}
                  uploadedFiles={uploadedFileRefs}
                />

                <FileUploaderMulti
                  label="Work Permit (optional)"
                  fieldName="permit"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple={false}
                  onChange={setPermitFilesClient}
                  uploadedFiles={uploadedFileRefs}
                />

                <FileUploaderMulti
                  label="Additional Documents (optional)"
                  fieldName="additional"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  multiple={true}
                  onChange={setAdditionalFilesClient}
                  uploadedFiles={uploadedFileRefs}
                />
              </div>
              {errors.resume && <div className="field-error">{errors.resume}</div>}
            </div>

            <div className="form-section">
              <h3 className="section-title">Additional Information</h3>
              <div className="form-group">
                <label className="form-label">Cover Letter (Optional)</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="form-textarea" rows={6} />
                <div className="char-count">{form.message.length}/500 characters</div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => router.back()} className="btn btn-secondary" disabled={loading}>Cancel</button>
              <button type="submit" disabled={loading} className={`btn btn-primary ${loading ? 'loading' : ''}`}>
                {loading ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>

            <div className="form-footer">
              <p className="disclaimer">
                By submitting this application, you agree to our <a href="/privacy" className="link">Privacy Policy</a>.
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .apply-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 0;
        }

        .apply-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .apply-header {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .back-button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .apply-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .job-preview {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid #dc2626;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .job-company {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .job-location {
          font-size: 0.875rem;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .apply-form-container {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .apply-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }

        .section-icon {
          font-size: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .required {
          color: #dc2626;
        }

        .form-input, .form-textarea {
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fafafa;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #dc2626;
          background: white;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .form-input.error, .form-textarea.error {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .field-error {
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .char-count {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: right;
          margin-top: 0.25rem;
        }

        .file-upload-grid {
          display: grid;
          gap: 1.5rem;
        }

        .file-upload-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-upload-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .file-upload-area {
          position: relative;
        }

        .file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .file-upload-content {
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .file-upload-area:hover .file-upload-content {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #059669;
        }

        .file-icon {
          font-size: 1.5rem;
        }

        .file-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-name {
          font-weight: 600;
        }

        .file-size {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .file-remove {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-remove:hover {
          background: #dc2626;
        }

        .file-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
        }

        .upload-icon {
          font-size: 2rem;
        }

        .upload-text {
          font-weight: 600;
        }

        .upload-hint {
          font-size: 0.875rem;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .global-error {
          margin-bottom: 1rem;
        }

        .file-error {
          margin-bottom: 1rem;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          min-width: 140px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: 1px solid #dc2626;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
          background: linear-gradient(135deg, #b91c1c, #991b1b);
        }

        .btn-secondary {
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn.loading {
          background: #9ca3af;
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .form-footer {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .disclaimer {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        .link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 500;
        }

        .link:hover {
          text-decoration: underline;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .apply-container {
            padding: 1rem 0;
          }

          .apply-header {
            padding: 1.5rem;
          }

          .apply-form-container {
            padding: 1.5rem;
          }

          .apply-title {
            font-size: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .apply-content {
            padding: 0 0.5rem;
          }

          .apply-header,
          .apply-form-container {
            padding: 1rem;
          }

          .file-selected {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .section-title {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}
