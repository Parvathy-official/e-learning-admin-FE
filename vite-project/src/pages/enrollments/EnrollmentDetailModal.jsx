import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { enrollmentsApi } from '../../api/enrollments';
import { useToast } from '../../context/ToastContext';
import { User, BookOpen, CreditCard, Clock, PlayCircle } from 'lucide-react';

export function EnrollmentDetailModal({ isOpen, onClose, enrollment = null, onUpdated }) {
  const [status, setStatus] = useState('active');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (enrollment) {
      setStatus(enrollment.status || 'active');
      setProgress(enrollment.progress_percentage || 0);
    }
  }, [enrollment]);

  if (!enrollment) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await enrollmentsApi.updateEnrollment(enrollment.id, {
        status,
        progress_percentage: parseInt(progress, 10),
      });
      toast.success('Enrollment Updated', 'Status and progress updated successfully.');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error('Update Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enrollment Record & Progress"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Updating...' : 'Save Updates'}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Student & Course Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <User size={13} /> STUDENT
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>
              {enrollment.user_name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {enrollment.user_email}
            </div>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <BookOpen size={13} /> COURSE
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>
              {enrollment.course_title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {enrollment.course_category || 'Academy Masterclass'}
            </div>
          </div>
        </div>

        {/* Payment and Enrollment Info */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>ENROLLED ON</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-heading)', fontWeight: 500, marginTop: '2px' }}>
              {enrollment.enrolled_at}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>PAYMENT STATUS</div>
            <div style={{ marginTop: '2px' }}>
              <Badge variant={enrollment.payment_status || 'paid'}>
                {enrollment.payment_status || 'Verified'}
              </Badge>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>AMOUNT PAID</div>
            <div style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
              {enrollment.payment_amount ? formatCurrency(enrollment.payment_amount) : 'Free Access'}
            </div>
          </div>
        </div>

        {/* Last Activity */}
        {enrollment.last_watched_lesson_title && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <PlayCircle size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LAST WATCHED LESSON</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-heading)', fontWeight: 500 }}>
                {enrollment.last_watched_lesson_title} (Position: {enrollment.last_watched_position || 0}s)
              </div>
            </div>
          </div>
        )}

        {/* Update Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Enrollment Status</label>
              <select
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Progress Percentage (0 - 100%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="input"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
