import React, { useState, useEffect } from 'react';
import { Shield, Key, User, LogOut, CheckCircle2 } from 'lucide-react';
import { settingsApi } from '../../api/settings';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const toast = useToast();

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Validation Error', 'Name is required.');
      return;
    }

    setProfileLoading(true);
    try {
      await settingsApi.updateProfile({
        name: profileData.name.trim(),
        avatar: profileData.avatar || null,
        bio: profileData.bio || '',
      });
      await refreshUser();
      toast.success('Profile Updated', 'Your admin profile details have been saved.');
    } catch (err) {
      toast.error('Update Failed', err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Validation Error', 'Current and new password are required.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Validation Error', 'New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Validation Error', 'New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await settingsApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success('Password Changed', 'Your password has been changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Password Change Failed', err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '840px' }}>
      <div className="page-header">
        <div className="page-header-info">
          <h1>Admin Account Settings</h1>
          <p className="page-subtitle">
            Manage your administrator credentials, personal profile, and authentication security
          </p>
        </div>
      </div>

      {/* Profile Settings Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <User size={18} color="var(--primary)" />
          <h3>Admin Profile Information</h3>
        </div>

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '8px' }}>
            <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="" />
              ) : (
                <span>{profileData.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                {user?.is_superuser ? 'Super Administrator' : 'Staff Administrator'}
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="input"
                value={profileData.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Avatar Image URL</label>
            <input
              type="url"
              className="input"
              placeholder="https://images.unsplash.com/..."
              value={profileData.avatar}
              onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bio</label>
            <textarea
              className="textarea"
              placeholder="Administrator bio..."
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Key size={18} color="var(--primary)" />
          <h3>Security & Password</h3>
        </div>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="input"
                placeholder="At least 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Repeat new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Session Card */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Log Out Session</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Terminate your current authenticated admin session on this browser
          </div>
        </div>
        <button className="btn btn-danger" onClick={logout}>
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}
