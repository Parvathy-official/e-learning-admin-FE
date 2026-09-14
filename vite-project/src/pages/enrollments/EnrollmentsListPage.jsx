import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, BookmarkCheck, Calendar, BookOpen } from 'lucide-react';
import { enrollmentsApi } from '../../api/enrollments';
import { EnrollmentDetailModal } from './EnrollmentDetailModal';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function EnrollmentsListPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toast = useToast();

  const loadEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await enrollmentsApi.getEnrollments({ search, status: statusFilter });
      setEnrollments(res.results || []);
    } catch (err) {
      toast.error('Failed to load enrollments', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, toast]);

  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]);

  const handleOpenDetail = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Enrollment Management</h1>
          <p className="page-subtitle">
            Student course registrations, completion tracking, and access status
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-group" style={{ flex: 1, minWidth: '260px' }}>
          <div className="input-icon-wrapper" style={{ width: '100%', maxWidth: '340px' }}>
            <Search size={16} className="input-icon-left" />
            <input
              type="text"
              className="input"
              placeholder="Search by student name, email, or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            className="select"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Enrollments Table */}
      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : enrollments.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No enrollments found matching your criteria"
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th>Progress</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enr) => (
                <tr key={enr.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {enr.user_avatar ? (
                          <img src={enr.user_avatar} alt="" />
                        ) : (
                          <span>{enr.user_name?.charAt(0)?.toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.875rem' }}>
                          {enr.user_name}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          {enr.user_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {enr.course_thumbnail && (
                        <img
                          src={enr.course_thumbnail}
                          alt=""
                          style={{ width: '40px', height: '26px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-heading)', fontSize: '0.85rem' }}>
                          {enr.course_title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {enr.course_category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {enr.enrolled_at}
                    </span>
                  </td>
                  <td>
                    <div style={{ width: '120px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                        <span>{enr.progress_percentage}%</span>
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${enr.progress_percentage}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary)',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: enr.payment_amount ? '#10B981' : 'var(--text-muted)' }}>
                      {enr.payment_amount ? formatCurrency(enr.payment_amount) : 'Free'}
                    </div>
                    {enr.payment_status && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Status: {enr.payment_status}
                      </div>
                    )}
                  </td>
                  <td>
                    <Badge variant={enr.status}>{enr.status}</Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenDetail(enr)}
                      title="View & Edit Enrollment Details"
                    >
                      <Eye size={14} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <EnrollmentDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        enrollment={selectedEnrollment}
        onUpdated={loadEnrollments}
      />
    </div>
  );
}
