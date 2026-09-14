import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Mail, Calendar, BookOpen, CreditCard } from 'lucide-react';
import { studentsApi } from '../../api/students';
import { StudentDetailDrawer } from './StudentDetailDrawer';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toast = useToast();

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getStudents({ search, role: roleFilter });
      setStudents(res.results || []);
    } catch (err) {
      toast.error('Failed to load students', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, toast]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleOpenStudent = (id) => {
    setSelectedStudentId(id);
    setDrawerOpen(true);
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
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Student Directory</h1>
          <p className="page-subtitle">
            Learner profiles, enrollment progression, and payment transaction history
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group" style={{ flex: 1, minWidth: '260px' }}>
          <div className="input-icon-wrapper" style={{ width: '100%', maxWidth: '340px' }}>
            <Search size={16} className="input-icon-left" />
            <input
              type="text"
              className="input"
              placeholder="Search by student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            className="select"
            style={{ width: 'auto' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Accounts</option>
            <option value="student">Learners Only</option>
            <option value="admin">Admin Staff Only</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : students.length === 0 ? (
        <EmptyState title="No students found matching your criteria" />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Email Address</th>
                <th>Join Date</th>
                <th>Enrolled Courses</th>
                <th>Total Spent</th>
                <th>Role</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} />
                        ) : (
                          <span>{student.name?.charAt(0)?.toUpperCase() || 'S'}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                          {student.name}
                        </div>
                        {student.bio && (
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {student.email}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {student.date_joined || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={14} color="var(--primary)" />
                      <strong style={{ color: 'var(--text-heading)' }}>{student.enrollments_count || 0}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ({student.active_enrollments || 0} active)
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: student.total_spent > 0 ? '#10B981' : 'var(--text-muted)' }}>
                      {formatCurrency(student.total_spent)}
                    </span>
                  </td>
                  <td>
                    {student.is_staff || student.is_superuser ? (
                      <Badge variant="primary">Staff</Badge>
                    ) : (
                      <Badge variant="neutral">Learner</Badge>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenStudent(student.id)}
                      title="View Student Full Profile & History"
                    >
                      <Eye size={14} />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Detail Slide-out Drawer */}
      <StudentDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        studentId={selectedStudentId}
      />
    </div>
  );
}
