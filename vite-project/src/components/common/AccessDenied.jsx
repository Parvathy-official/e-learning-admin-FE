import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AccessDenied() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-app)',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          padding: '40px 32px',
          border: '1px solid var(--border-medium)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ marginBottom: '8px', color: 'var(--text-heading)' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Your account (<strong>{user?.email || 'Current User'}</strong>) does not have administrator privileges (<code style={{ color: 'var(--primary-light)' }}>is_staff</code> or <code style={{ color: 'var(--primary-light)' }}>is_superuser</code>).
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => (window.location.href = '/')}>
            Reload Page
          </button>
          <button className="btn btn-danger" onClick={logout}>
            <LogOut size={16} /> Log Out & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
