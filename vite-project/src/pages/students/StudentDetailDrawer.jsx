import React, { useState, useEffect } from 'react';
import { Drawer } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { studentsApi } from '../../api/students';
import { Mail, Calendar, BookOpen, CreditCard, User, Award } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function StudentDetailDrawer({ isOpen, onClose, studentId }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true);
      studentsApi
        .getStudentDetail(studentId)
        .then((data) => setStudent(data))
        .catch((err) => toast.error('Failed to load student details', err.message))
        .finally(() => setLoading(false));
    } else {
      setStudent(null);
    }
  }, [isOpen, studentId, toast]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Student Profile & History">
      {loading || !student ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton skeleton-card" style={{ height: '100px' }} />
          <div className="skeleton skeleton-card" style={{ height: '140px' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
              {student.avatar ? (
                <img src={student.avatar} alt={student.name} />
              ) : (
                <span>{student.name?.charAt(0)?.toUpperCase() || 'S'}</span>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-heading)' }}>{student.name}</h3>
                {student.is_staff || student.is_superuser ? (
                  <Badge variant="primary">Staff</Badge>
                ) : (
                  <Badge variant="info">Student</Badge>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                <Mail size={13} /> {student.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                <Calendar size={13} /> Joined {student.date_joined || 'N/A'}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Enrolled Courses
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-heading)', marginTop: '4px' }}>
                {student.enrollments_count || 0}
              </div>
            </div>

            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Spent
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>
                {formatCurrency(student.total_spent)}
              </div>
            </div>
          </div>

          {/* Enrollments & Progress */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={16} color="var(--primary)" />
              <h4 style={{ fontSize: '0.95rem' }}>Course Enrollments & Progress</h4>
            </div>

            {(!student.enrollments || student.enrollments.length === 0) ? (
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: '0.825rem', textAlign: 'center' }}>
                No course enrollments found for this student.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {student.enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.875rem' }}>
                        {enr.course_title}
                      </div>
                      <Badge variant={enr.status}>{enr.status}</Badge>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ margin: '8px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span>Progress</span>
                        <span>{enr.progress_percentage}%</span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${enr.progress_percentage}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      <span>Enrolled: {enr.enrolled_at}</span>
                      {enr.last_watched_lesson_title && (
                        <span>Last: {enr.last_watched_lesson_title}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment History */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CreditCard size={16} color="var(--primary)" />
              <h4 style={{ fontSize: '0.95rem' }}>Payment Transactions</h4>
            </div>

            {(!student.payments || student.payments.length === 0) ? (
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: '0.825rem', textAlign: 'center' }}>
                No payment transactions recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {student.payments.map((pmt) => (
                  <div
                    key={pmt.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.825rem', color: 'var(--text-heading)' }}>
                        {pmt.course_title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Order: {pmt.razorpay_order_id} • {pmt.created_at}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: pmt.status === 'paid' ? '#10B981' : 'var(--text-primary)', fontSize: '0.85rem' }}>
                        {formatCurrency(pmt.amount)}
                      </div>
                      <Badge variant={pmt.status}>{pmt.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
