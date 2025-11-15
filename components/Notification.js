// components/Notification.js
import { useEffect } from 'react';

export default function Notification({ type = 'info', message = '', onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg = type === 'success' ? '#ecfdf5' : type === 'error' ? '#fff1f2' : '#eef2ff';
  const color = type === 'success' ? '#065f46' : type === 'error' ? '#9f1239' : '#1e3a8a';
  const border = type === 'success' ? '#10b981' : type === 'error' ? '#f43f5e' : '#3b82f6';

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      minWidth: 280,
      background: bg,
      color,
      borderLeft: `4px solid ${border}`,
      boxShadow: '0 8px 30px rgba(2,6,23,0.08)',
      padding: '12px 16px',
      borderRadius: 8,
      fontWeight: 600,
    }}>
      <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center'}}>
        <div style={{flex:1}}>{message}</div>
        <button onClick={() => onClose && onClose()} style={{
          marginLeft: 12,
          background: 'transparent',
          border: 'none',
          color,
          fontSize: 16,
          cursor: 'pointer'
        }}>✕</button>
      </div>
    </div>
  );
}
