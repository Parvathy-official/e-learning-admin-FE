import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Search, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function TopBar({ onToggleMobile }) {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = (pathname) => {
    if (pathname === '/' || pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/courses')) {
      if (pathname.includes('/content')) return 'Course Curriculum Management';
      return 'Courses Management';
    }
    if (pathname.startsWith('/students')) return 'Students Management';
    if (pathname.startsWith('/instructors')) return 'Instructors Management';
    if (pathname.startsWith('/enrollments')) return 'Enrollments Management';
    if (pathname.startsWith('/payments')) return 'Payments Management';
    if (pathname.startsWith('/settings')) return 'Admin Settings';
    return 'Admin Portal';
  };

  const currentTitle = getPageTitle(location.pathname);

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleMobile}
          style={{ display: 'none' }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumb-trail">
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Admin</Link>
          <span>/</span>
          <span className="breadcrumb-current">{currentTitle}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Shield size={14} color="var(--primary)" />
          <span>{user?.is_superuser ? 'Superuser Portal' : 'Staff Portal'}</span>
        </div>

        <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
          )}
        </div>
      </div>
    </header>
  );
}
