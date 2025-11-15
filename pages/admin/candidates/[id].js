// pages/admin/candidates/[id].js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';

const fetcher = u => fetch(u).then(r => r.json());

export default function AdminCandidateView() {
  const router = useRouter();
  const { id } = router.query;
  const { data, mutate } = useSWR(() => (id ? `/api/admin/candidates/${id}` : null), fetcher);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  if (!data) {
    return (
      <div className="admin-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading candidate details...</p>
        </div>
      </div>
    );
  }

  const { candidate, applications } = data;

  function startEdit() {
    setForm({ 
      name: candidate.name || '', 
      email: candidate.email || '', 
      phone: candidate.phone || '',
      summary: candidate.summary || ''
    });
    setEditing(true);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/candidates/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Save failed');
      setEditing(false);
      await mutate();
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally { setSaving(false); }
  }

  async function addInternalNote() {
    if (!note.trim()) return;
    try {
      const res = await fetch(`/api/admin/applications/${applications[0]?._id || ''}`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ note })
      });
      setNote('');
      alert('Note added successfully');
      await mutate();
    } catch (err) {
      alert('Failed to add note');
    }
  }

  async function removeCandidate() {
    if (!confirm('Are you sure you want to delete this candidate? This action will flag their applications and cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/candidates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.push('/admin/candidates');
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'applied': '#3b82f6',
      'reviewed': '#f59e0b',
      'interview': '#8b5cf6',
      'rejected': '#ef4444',
      'hired': '#10b981',
      'pending': '#6b7280'
    };
    return colors[status?.toLowerCase()] || '#6b7280';
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="breadcrumb">
            <Link href="/admin" className="breadcrumb-link">Admin</Link>
            <span className="breadcrumb-separator">/</span>
            <Link href="/admin/candidates" className="breadcrumb-link">Candidates</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Candidate Details</span>
          </div>

          <div className="header-main">
            <div className="candidate-info">
              <div className="candidate-avatar">
                {candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'C'}
              </div>
              <div className="candidate-details">
                <h1 className="candidate-name">{candidate.name || 'Unnamed Candidate'}</h1>
                <div className="candidate-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📧</span>
                    {candidate.email}
                  </span>
                  {candidate.phone && (
                    <span className="meta-item">
                      <span className="meta-icon">📞</span>
                      {candidate.phone}
                    </span>
                  )}
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    Joined {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                </div>
              </div>
            </div>

            <div className="header-actions">
              <button onClick={startEdit} className="btn btn-secondary">
                <span className="btn-icon">✏️</span>
                Edit Profile
              </button>
              <Link href="/admin/candidates" className="btn btn-outline">
                <span className="btn-icon">←</span>
                Back to List
              </Link>
              <button onClick={removeCandidate} className="btn btn-danger">
                <span className="btn-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="tab-icon">👤</span>
            Profile
          </button>
          <button 
            className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <span className="tab-icon">📄</span>
            Applications ({applications.length})
          </button>
          <button 
            className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span className="tab-icon">📎</span>
            Documents
          </button>
          <button 
            className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <span className="tab-icon">📝</span>
            Internal Notes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Candidate Profile</h2>
              {!editing && (
                <button onClick={startEdit} className="btn btn-secondary btn-sm">
                  <span className="btn-icon">✏️</span>
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="edit-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Enter candidate's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      value={form.phone}
                      onChange={e => setForm({...form, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Professional Summary</label>
                    <textarea
                      className="form-textarea"
                      value={form.summary}
                      onChange={e => setForm({...form, summary: e.target.value})}
                      placeholder="Enter professional summary"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button onClick={saveProfile} className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">💾</span>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-display">
                <div className="info-grid">
                  <div className="info-item">
                    <label className="info-label">Full Name</label>
                    <div className="info-value">{candidate.name || 'Not provided'}</div>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Email Address</label>
                    <div className="info-value">{candidate.email}</div>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Phone Number</label>
                    <div className="info-value">{candidate.phone || 'Not provided'}</div>
                  </div>
                  <div className="info-item full-width">
                    <label className="info-label">Professional Summary</label>
                    <div className="info-value">
                      {candidate.summary || 'No summary provided by the candidate.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Job Applications</h2>
              <div className="applications-count">{applications.length} total applications</div>
            </div>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Applications</h3>
                <p>This candidate hasn't submitted any job applications yet.</p>
              </div>
            ) : (
              <div className="applications-grid">
                {applications.map(application => (
                  <div key={application._id} className="application-card">
                    <div className="application-header">
                      <h3 className="application-title">{application.jobTitle || 'Untitled Job'}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(application.status) }}
                      >
                        {application.status || 'applied'}
                      </span>
                    </div>
                    
                    <div className="application-meta">
                      <span className="meta-item">
                        <span className="meta-icon">📅</span>
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                      {application.employer && (
                        <span className="meta-item">
                          <span className="meta-icon">🏢</span>
                          {application.employer}
                        </span>
                      )}
                    </div>

                    {application.message && (
                      <div className="application-message">
                        <label className="message-label">Cover Message:</label>
                        <p className="message-text">{application.message}</p>
                      </div>
                    )}

                    <div className="application-actions">
                      <Link href={`/admin/applications/${application._id}`} className="btn btn-primary btn-sm">
                    View Details
                    </Link>
                      <Link href={`/jobs/${application.jobId}`}>
                        <a className="btn btn-outline btn-sm" target="_blank">
                          <span className="btn-icon">🔗</span>
                          View Job
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Uploaded Documents</h2>
              <div className="documents-count">
                {candidate.files?.length || 0} files
              </div>
            </div>

            {!candidate.files || candidate.files.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📎</div>
                <h3>No Documents</h3>
                <p>This candidate hasn't uploaded any documents yet.</p>
              </div>
            ) : (
              <div className="documents-grid">
                {candidate.files.map((file, index) => (
                  <div key={file.id || file._id || index} className="document-card">
                    <div className="document-icon">📄</div>
                    <div className="document-info">
                      <h4 className="document-name">{file.originalName || file.filename || 'Unnamed File'}</h4>
                      <div className="document-meta">
                        <span className="file-type">{file.field || 'document'}</span>
                        {file.size && (
                          <span className="file-size">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="document-actions">
                      <a 
                        href={`/api/file/${file.id || file._id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <span className="btn-icon">⬇️</span>
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Internal Notes</h2>
              <div className="notes-count">
                {candidate.notes?.length || 0} notes
              </div>
            </div>

            <div className="notes-container">
              <div className="notes-list">
                {!candidate.notes || candidate.notes.length === 0 ? (
                  <div className="empty-notes">
                    <div className="empty-icon">📝</div>
                    <h3>No Notes Yet</h3>
                    <p>Add the first internal note for this candidate.</p>
                  </div>
                ) : (
                  candidate.notes.map((note, index) => (
                    <div key={index} className="note-item">
                      <div className="note-header">
                        <span className="note-author">{note.adminName || 'Admin'}</span>
                        <span className="note-date">
                          {note.createdAt ? new Date(note.createdAt).toLocaleString() : 'Unknown date'}
                        </span>
                      </div>
                      <div className="note-content">
                        {note.text || note.note}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="add-note-section">
                <h3 className="add-note-title">Add New Note</h3>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="note-textarea"
                  placeholder="Enter internal note about this candidate..."
                  rows="4"
                />
                <div className="note-actions">
                  <button onClick={addInternalNote} className="btn btn-primary">
                    <span className="btn-icon">💾</span>
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Header Styles */
        .admin-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .breadcrumb-link {
          color: #dc2626;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: #b91c1c;
          text-decoration: underline;
        }

        .breadcrumb-separator {
          color: #d1d5db;
        }

        .breadcrumb-current {
          color: #374151;
          font-weight: 500;
        }

        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .candidate-avatar {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .candidate-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .candidate-name {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .candidate-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .meta-icon {
          font-size: 1rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        /* Tabs */
        .tabs-container {
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .tabs {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          gap: 0;
        }

        .tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #6b7280;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab:hover {
          color: #374151;
          background: #f9fafb;
        }

        .tab.active {
          color: #dc2626;
          border-bottom-color: #dc2626;
          background: #fef2f2;
        }

        .tab-icon {
          font-size: 1.125rem;
        }

        /* Content */
        .admin-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .content-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .section-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .applications-count, .documents-count, .notes-count {
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Forms */
        .edit-form {
          padding: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-input, .form-textarea {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #dc2626;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        /* Profile Display */
        .profile-display {
          padding: 2rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .info-value {
          color: #6b7280;
          line-height: 1.5;
        }

        /* Applications */
        .applications-grid {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .application-card {
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .application-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .application-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .application-meta {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .application-message {
          margin-bottom: 1.5rem;
        }

        .message-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .message-text {
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        .application-actions {
          display: flex;
          gap: 0.75rem;
        }

        /* Documents */
        .documents-grid {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .document-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .document-icon {
          font-size: 2rem;
        }

        .document-info {
          flex: 1;
        }

        .document-name {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
        }

        .document-meta {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .file-type {
          text-transform: capitalize;
        }

        /* Notes */
        .notes-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          min-height: 500px;
        }

        .notes-list {
          padding: 1.5rem;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .note-item {
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fafafa;
        }

        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .note-author {
          font-weight: 600;
          color: #374151;
        }

        .note-date {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .note-content {
          color: #4b5563;
          line-height: 1.5;
        }

        .add-note-section {
          padding: 1.5rem;
          background: #f8fafc;
        }

        .add-note-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .note-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          margin-bottom: 1rem;
        }

        .note-textarea:focus {
          outline: none;
          border-color: #dc2626;
        }

        .note-actions {
          display: flex;
          justify-content: flex-end;
        }

        /* Empty States */
        .empty-state, .empty-notes, .loading-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3, .empty-notes h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .empty-state p, .empty-notes p {
          margin: 0;
        }

        /* Buttons */
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: 1px solid #dc2626;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .btn-secondary {
          background: #374151;
          color: white;
          border: 1px solid #374151;
        }

        .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
          border: 1px solid #ef4444;
        }

        .btn-danger:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-icon {
          font-size: 1rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .notes-container {
            grid-template-columns: 1fr;
          }

          .notes-list {
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            max-height: 300px;
          }
        }

        @media (max-width: 768px) {
          .header-main {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            justify-content: flex-start;
          }

          .tabs {
            overflow-x: auto;
          }

          .form-grid, .info-grid {
            grid-template-columns: 1fr;
          }

          .candidate-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .application-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .application-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .document-card {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
          }

          .document-actions {
            align-self: stretch;
          }

          .document-actions .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .header-content, .admin-content {
            padding: 0 0.5rem;
          }

          .candidate-name {
            font-size: 1.5rem;
          }

          .section-header {
            padding: 1rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .edit-form, .profile-display, .applications-grid, .documents-grid {
            padding: 1rem;
          }

          .form-actions, .application-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}