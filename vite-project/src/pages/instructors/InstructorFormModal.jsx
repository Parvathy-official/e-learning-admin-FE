import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export function InstructorFormModal({ isOpen, onClose, onSave, instructor = null, loading = false }) {
  const isEditing = Boolean(instructor);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    if (instructor) {
      setFormData({
        name: instructor.name || '',
        title: instructor.title || '',
        bio: instructor.bio || '',
        avatar: instructor.avatar || '',
      });
    } else {
      setFormData({
        name: '',
        title: 'Principal Paid Media Buyer',
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      });
    }
  }, [instructor, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Validation Error', 'Instructor name is required.');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Instructor Profile' : 'Add New Instructor'}
      size="sm"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Instructor'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">
            Instructor Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="e.g. Devon Vance"
            value={formData.name}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Title / Role</label>
          <input
            type="text"
            name="title"
            className="input"
            placeholder="e.g. Head of Growth & Paid Media Architect"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Avatar Image URL</label>
          <input
            type="url"
            name="avatar"
            className="input"
            placeholder="https://images.unsplash.com/..."
            value={formData.avatar}
            onChange={handleChange}
          />
          {formData.avatar && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={formData.avatar}
                alt="Avatar Preview"
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avatar Preview</span>
            </div>
          )}
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Bio & Professional Background</label>
          <textarea
            name="bio"
            className="textarea"
            placeholder="Specializes in $10M+ scaling frameworks for Meta and Google Ads..."
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
}
