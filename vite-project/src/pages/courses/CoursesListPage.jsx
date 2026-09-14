import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ListTree,
  ExternalLink,
  Eye,
  CheckCircle2,
  Star,
  Flame,
  Award,
} from 'lucide-react';
import { coursesApi } from '../../api/courses';
import { instructorsApi } from '../../api/instructors';
import { CourseFormModal } from './CourseFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function CoursesListPage() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Delete dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Filter state
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getCourses({
        search,
        category: categoryFilter,
        is_published: publishedFilter,
        instructor_id: instructorFilter,
      });
      setCourses(res.results || []);
    } catch (err) {
      toast.error('Failed to load courses', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, publishedFilter, instructorFilter, toast]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    instructorsApi
      .getInstructors()
      .then((res) => setInstructors(res.results || []))
      .catch(() => {});
  }, []);

  const handleOpenCreate = () => {
    setSelectedCourse(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleSaveCourse = async (formData) => {
    setSaveLoading(true);
    try {
      if (selectedCourse) {
        await coursesApi.updateCourse(selectedCourse.id, formData);
        toast.success('Course Updated', `Successfully updated "${formData.title}"`);
      } else {
        await coursesApi.createCourse(formData);
        toast.success('Course Created', `Successfully created "${formData.title}"`);
      }
      setModalOpen(false);
      loadCourses();
    } catch (err) {
      toast.error('Failed to save course', err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      const res = await coursesApi.togglePublish(course.id);
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_published: res.is_published } : c))
      );
      toast.info(
        'Status Updated',
        `Course is now ${res.is_published ? 'Published' : 'Draft'}`
      );
    } catch (err) {
      toast.error('Failed to toggle status', err.message);
    }
  };

  const handleToggleFeatured = async (course) => {
    try {
      const res = await coursesApi.toggleFeatured(course.id);
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_featured: res.is_featured } : c))
      );
      toast.info(
        'Featured Updated',
        `Course is ${res.is_featured ? 'marked as Featured' : 'unfeatured'}`
      );
    } catch (err) {
      toast.error('Failed to toggle featured', err.message);
    }
  };

  const handleToggleBestseller = async (course) => {
    try {
      const res = await coursesApi.toggleBestseller(course.id);
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_bestseller: res.is_bestseller } : c))
      );
      toast.info(
        'Bestseller Updated',
        `Course is ${res.is_bestseller ? 'marked as Bestseller' : 'regular'}`
      );
    } catch (err) {
      toast.error('Failed to toggle bestseller', err.message);
    }
  };

  const handleOpenDelete = (course) => {
    setCourseToDelete(course);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    try {
      await coursesApi.deleteCourse(courseToDelete.id);
      toast.success('Course Deleted', `Deleted "${courseToDelete.title}"`);
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
      loadCourses();
    } catch (err) {
      toast.error('Failed to delete course', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-info">
          <h1>Masterclass Catalog</h1>
          <p className="page-subtitle">
            Manage course curriculum, pricing, video contents, and catalog visibility
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>Create Masterclass</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="filter-group" style={{ flex: 1, minWidth: '240px' }}>
          <div className="input-icon-wrapper" style={{ width: '100%', maxWidth: '320px' }}>
            <Search size={16} className="input-icon-left" />
            <input
              type="text"
              className="input"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <select
            className="select"
            style={{ width: 'auto' }}
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>

          <select
            className="select"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Performance Marketing">Performance Marketing</option>
            <option value="Paid Media">Paid Media</option>
            <option value="Growth Marketing">Growth Marketing</option>
          </select>

          <select
            className="select"
            style={{ width: 'auto' }}
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
          >
            <option value="">All Instructors</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Data Table */}
      {loading ? (
        <TableSkeleton rows={4} cols={8} />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Try adjusting your search criteria or create a new course."
          actionText="Create First Course"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thumbnail & Title</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Price</th>
                <th>Modules / Lessons</th>
                <th>Students</th>
                <th>Status</th>
                <th>Badges</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt=""
                          style={{
                            width: '56px',
                            height: '38px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid var(--border-subtle)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '56px',
                            height: '38px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--bg-surface-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          No Image
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>
                          {course.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          slug: /{course.slug} • {course.duration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="user-avatar" style={{ width: '24px', height: '24px', fontSize: '0.65rem' }}>
                        {course.instructor?.avatar ? (
                          <img src={course.instructor.avatar} alt="" />
                        ) : (
                          <span>{course.instructor?.name?.charAt(0) || 'I'}</span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.825rem' }}>
                        {course.instructor?.name || 'Unassigned'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {course.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                      ₹{course.price}
                    </div>
                    {course.original_price && (
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{course.original_price}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>
                      <strong>{course.modules_count || 0}</strong> modules • <strong>{course.lessons_count || 0}</strong> lessons
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.825rem' }}>
                      <strong>{course.total_enrollments || 0}</strong> registered
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      ⭐ {course.rating} ({course.total_ratings})
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-ghost"
                      style={{ padding: '2px 0' }}
                      onClick={() => handleTogglePublish(course)}
                      title="Click to toggle publish status"
                    >
                      <Badge variant={course.is_published ? 'published' : 'draft'}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        className={`btn-icon btn-sm ${course.is_featured ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ padding: '3px 6px', fontSize: '0.7rem' }}
                        onClick={() => handleToggleFeatured(course)}
                        title="Toggle Featured"
                      >
                        <Star size={12} fill={course.is_featured ? '#030708' : 'none'} />
                        {course.is_featured && ' Featured'}
                      </button>
                      <button
                        className={`btn-icon btn-sm ${course.is_bestseller ? 'btn-secondary' : 'btn-ghost'}`}
                        style={{ padding: '3px 6px', fontSize: '0.7rem', color: course.is_bestseller ? '#F59E0B' : 'var(--text-muted)' }}
                        onClick={() => handleToggleBestseller(course)}
                        title="Toggle Bestseller"
                      >
                        <Flame size={12} fill={course.is_bestseller ? '#F59E0B' : 'none'} />
                        {course.is_bestseller && ' Bestseller'}
                      </button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Link
                        to={`/courses/${course.id}/content`}
                        className="btn btn-secondary btn-sm"
                        title="Manage Modules & Lessons Curriculum"
                      >
                        <ListTree size={14} color="var(--primary)" />
                        <span>Curriculum</span>
                      </Link>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenEdit(course)}
                        title="Edit course details"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenDelete(course)}
                        title="Delete course"
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Create/Edit Form Modal */}
      <CourseFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCourse}
        course={selectedCourse}
        loading={saveLoading}
      />

      {/* Course Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Masterclass Course"
        message={`Are you sure you want to permanently delete "${courseToDelete?.title}"? All associated modules, lessons, and records will be deleted.`}
        confirmText="Delete Course"
        loading={deleteLoading}
      />
    </div>
  );
}
