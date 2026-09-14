import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { instructorsApi } from '../../api/instructors';
import { GraduationCap, BookOpen, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function InstructorDetailDrawer({ isOpen, onClose, instructorId }) {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && instructorId) {
      setLoading(true);
      instructorsApi
        .getInstructorDetail(instructorId)
        .then((data) => setInstructor(data))
        .catch((err) => toast.error('Failed to load instructor', err.message))
        .finally(() => setLoading(false));
    } else {
      setInstructor(null);
    }
  }, [isOpen, instructorId, toast]);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Instructor Profile">
      {loading || !instructor ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="skeleton skeleton-card" style={{ height: '120px' }} />
          <div className="skeleton skeleton-card" style={{ height: '160px' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile Card */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.4rem' }}>
              {instructor.avatar ? (
                <img src={instructor.avatar} alt={instructor.name} />
              ) : (
                <span>{instructor.name?.charAt(0)?.toUpperCase() || 'I'}</span>
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-heading)' }}>{instructor.name}</h3>
              <div style={{ color: 'var(--primary-light)', fontSize: '0.85rem', fontWeight: 500, margin: '2px 0 8px' }}>
                {instructor.title || 'Academy Instructor'}
              </div>
              {instructor.bio && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                  {instructor.bio}
                </p>
              )}
            </div>
          </div>

          {/* Assigned Courses */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--primary)" />
                <h4 style={{ fontSize: '0.95rem' }}>Assigned Masterclasses ({instructor.courses?.length || 0})</h4>
              </div>
            </div>

            {(!instructor.courses || instructor.courses.length === 0) ? (
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', fontSize: '0.825rem', textAlign: 'center' }}>
                No courses currently assigned to this instructor.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {instructor.courses.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {c.thumbnail && (
                        <img
                          src={c.thumbnail}
                          alt=""
                          style={{ width: '48px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-heading)' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          ₹{c.price} • {c.total_students || 0} students
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge variant={c.is_published ? 'published' : 'draft'}>
                        {c.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Link
                        to={`/courses/${c.id}/content`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        Curriculum
                      </Link>
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
