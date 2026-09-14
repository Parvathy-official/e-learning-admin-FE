import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  BookmarkCheck,
  CreditCard,
  Settings,
  LogOut,
  Zap,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Courses', path: '/courses', icon: BookOpen },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Instructors', path: '/instructors', icon: GraduationCap },
  { name: 'Enrollments', path: '/enrollments', icon: BookmarkCheck },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();

  return (
    <>
      <div
        className={`mobile-sidebar-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={onCloseMobile}
      />
      <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="brand-logo" onClick={onCloseMobile}>
            <div className="brand-icon">
              <Zap size={18} />
            </div>
            <span>LearnFlow</span>
            <span className="brand-badge">ADMIN</span>
          </NavLink>
          {mobileOpen && (
            <button className="btn-icon" onClick={onCloseMobile} aria-label="Close sidebar">
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={onCloseMobile}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-user-info">
            <div className="user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Administrator'}</span>
              <span className="user-role">
                {user?.is_superuser ? 'Super Admin' : 'Staff Admin'}
              </span>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={logout}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
