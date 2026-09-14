import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Video,
  PlayCircle,
  Eye,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { coursesApi } from '../../api/courses';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function CourseContentPage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Module modal state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleSaveLoading, setModuleSaveLoading] = useState(false);

  // Lesson modal state
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    duration: '15:00',
    duration_seconds: 900,
    video_url: '',
    is_preview: false,
  });
  const [lessonSaveLoading, setLessonSaveLoading] = useState(false);

  // Delete dialog state
  const [deleteDialogState, setDeleteDialogState] = useState({
    isOpen: false,
    type: null, // 'module' | 'lesson'
    item: null,
    loading: false,
  });

  const toast = useToast();

  const loadCurriculum = useCallback(async () => {
    setLoading(true);
    try {
      const [courseRes, curriculumRes] = await Promise.all([
        coursesApi.getCourse(courseId),
        coursesApi.getCurriculum(courseId),
      ]);
      setCourse(courseRes);
      setModules(curriculumRes.modules || []);
    } catch (err) {
      toast.error('Failed to load curriculum', err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId, toast]);

  useEffect(() => {
    loadCurriculum();
  }, [loadCurriculum]);

  // Module Handlers
  const handleOpenAddModule = () => {
    setSelectedModule(null);
    setModuleTitle('');
    setModuleModalOpen(true);
  };

  const handleOpenEditModule = (module) => {
    setSelectedModule(module);
    setModuleTitle(module.title);
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!moduleTitle.trim()) {
      toast.error('Validation Error', 'Module title is required');
      return;
    }

    setModuleSaveLoading(true);
    try {
      if (selectedModule) {
        await coursesApi.updateModule(selectedModule.id, { title: moduleTitle.trim() });
        toast.success('Module Updated', `Updated "${moduleTitle}"`);
      } else {
        await coursesApi.createModule(courseId, { title: moduleTitle.trim() });
        toast.success('Module Created', `Created "${moduleTitle}"`);
      }
      setModuleModalOpen(false);
      loadCurriculum();
    } catch (err) {
      toast.error('Failed to save module', err.message);
    } finally {
      setModuleSaveLoading(false);
    }
  };

  const handleMoveModule = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const updated = [...modules];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const orders = updated.map((m, idx) => ({ id: m.id, order: idx + 1 }));
    setModules(updated);

    try {
      await coursesApi.reorderModules(courseId, orders);
      toast.info('Reordered', 'Module order updated');
    } catch (err) {
      toast.error('Failed to reorder', err.message);
      loadCurriculum();
    }
  };

  // Lesson Handlers
  const handleOpenAddLesson = (moduleId) => {
    setTargetModuleId(moduleId);
    setSelectedLesson(null);
    setLessonFormData({
      title: '',
      duration: '15:00',
      duration_seconds: 900,
      video_url: '',
      is_preview: false,
    });
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = (moduleId, lesson) => {
    setTargetModuleId(moduleId);
    setSelectedLesson(lesson);
    setLessonFormData({
      title: lesson.title,
      duration: lesson.duration || '15:00',
      duration_seconds: lesson.duration_seconds || 900,
      video_url: lesson.video_url || '',
      is_preview: Boolean(lesson.is_preview),
    });
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) {
      toast.error('Validation Error', 'Lesson title is required');
      return;
    }

    setLessonSaveLoading(true);
    try {
      if (selectedLesson) {
        await coursesApi.updateLesson(selectedLesson.id, lessonFormData);
        toast.success('Lesson Updated', `Updated "${lessonFormData.title}"`);
      } else {
        await coursesApi.createLesson(targetModuleId, lessonFormData);
        toast.success('Lesson Created', `Added "${lessonFormData.title}"`);
      }
      setLessonModalOpen(false);
      loadCurriculum();
    } catch (err) {
      toast.error('Failed to save lesson', err.message);
    } finally {
      setLessonSaveLoading(false);
    }
  };

  const handleMoveLesson = async (moduleIndex, lessonIndex, direction) => {
    const mod = modules[moduleIndex];
    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= mod.lessons.length) return;

    const updatedLessons = [...mod.lessons];
    const temp = updatedLessons[lessonIndex];
    updatedLessons[lessonIndex] = updatedLessons[targetIndex];
    updatedLessons[targetIndex] = temp;

    const updatedModules = [...modules];
    updatedModules[moduleIndex] = { ...mod, lessons: updatedLessons };
    setModules(updatedModules);

    const orders = updatedLessons.map((l, idx) => ({ id: l.id, order: idx + 1 }));

    try {
      await coursesApi.reorderLessons(mod.id, orders);
      toast.info('Reordered', 'Lesson order updated');
    } catch (err) {
      toast.error('Failed to reorder lessons', err.message);
      loadCurriculum();
    }
  };

  // Delete Handlers
  const handleOpenDelete = (type, item) => {
    setDeleteDialogState({
      isOpen: true,
      type,
      item,
      loading: false,
    });
  };

  const handleConfirmDelete = async () => {
    const { type, item } = deleteDialogState;
    if (!item) return;

    setDeleteDialogState((prev) => ({ ...prev, loading: true }));
    try {
      if (type === 'module') {
        await coursesApi.deleteModule(item.id);
        toast.success('Module Deleted', `Deleted "${item.title}"`);
      } else if (type === 'lesson') {
        await coursesApi.deleteLesson(item.id);
        toast.success('Lesson Deleted', `Deleted "${item.title}"`);
      }
      setDeleteDialogState({ isOpen: false, type: null, item: null, loading: false });
      loadCurriculum();
    } catch (err) {
      toast.error('Failed to delete item', err.message);
      setDeleteDialogState((prev) => ({ ...prev, loading: false }));
    }
  };

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);

  return (
    <div className="page-container">
      {/* Back button & Course header */}
      <div>
        <Link
          to="/courses"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} /> Back to Courses Catalog
        </Link>
        <div className="page-header">
          <div className="page-header-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1>{course?.title || 'Course Curriculum'}</h1>
              {course && (
                <Badge variant={course.is_published ? 'published' : 'draft'}>
                  {course.is_published ? 'Published' : 'Draft'}
                </Badge>
              )}
            </div>
            <p className="page-subtitle">
              Structured modules & video lessons hierarchy • {modules.length} Modules • {totalLessons} Lessons
            </p>
          </div>
          <div className="page-actions">
            <button className="btn btn-primary" onClick={handleOpenAddModule}>
              <Plus size={16} />
              <span>Add Module</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Module Tree */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      ) : modules.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No modules in this course yet"
          description="Create your first curriculum module to start adding lessons."
          actionText="Add First Module"
          onAction={handleOpenAddModule}
        />
      ) : (
        <div className="curriculum-container">
          {modules.map((module, modIdx) => (
            <div key={module.id} className="module-card">
              {/* Module Header */}
              <div className="module-header">
                <div className="module-title-group">
                  <span className="module-order-badge">Module {modIdx + 1}</span>
                  <span className="module-title">{module.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({module.lessons?.length || 0} Lessons)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Module Reordering */}
                  <button
                    className="btn-icon btn-sm"
                    disabled={modIdx === 0}
                    onClick={() => handleMoveModule(modIdx, 'up')}
                    title="Move Module Up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    className="btn-icon btn-sm"
                    disabled={modIdx === modules.length - 1}
                    onClick={() => handleMoveModule(modIdx, 'down')}
                    title="Move Module Down"
                  >
                    <ChevronDown size={16} />
                  </button>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleOpenAddLesson(module.id)}
                    style={{ marginLeft: '6px' }}
                  >
                    <Plus size={13} /> Add Lesson
                  </button>
                  <button
                    className="btn-icon btn-sm"
                    onClick={() => handleOpenEditModule(module)}
                    title="Edit Module"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn-icon btn-sm"
                    onClick={() => handleOpenDelete('module', module)}
                    title="Delete Module"
                  >
                    <Trash2 size={14} color="#EF4444" />
                  </button>
                </div>
              </div>

              {/* Lessons List in Module */}
              <div className="lesson-list">
                {(!module.lessons || module.lessons.length === 0) ? (
                  <div style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    No lessons yet in this module. Click "+ Add Lesson" to create one.
                  </div>
                ) : (
                  module.lessons.map((lesson, lesIdx) => (
                    <div key={lesson.id} className="lesson-item">
                      <div className="lesson-left">
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '20px' }}>
                          {lesIdx + 1}.
                        </span>
                        <PlayCircle size={16} color="var(--primary)" />
                        <div>
                          <div className="lesson-title">{lesson.title}</div>
                          {lesson.video_url && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              Source: {lesson.video_url}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="lesson-meta">
                          <Clock size={13} />
                          <span>{lesson.duration || '15:00'}</span>
                        </div>

                        {lesson.is_preview ? (
                          <Badge variant="primary" dot={false}>Free Preview</Badge>
                        ) : (
                          <Badge variant="neutral" dot={false}>Enrolled Only</Badge>
                        )}

                        {/* Lesson Reordering */}
                        <button
                          className="btn-icon"
                          style={{ padding: '4px' }}
                          disabled={lesIdx === 0}
                          onClick={() => handleMoveLesson(modIdx, lesIdx, 'up')}
                          title="Move Lesson Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ padding: '4px' }}
                          disabled={lesIdx === module.lessons.length - 1}
                          onClick={() => handleMoveLesson(modIdx, lesIdx, 'down')}
                          title="Move Lesson Down"
                        >
                          <ChevronDown size={14} />
                        </button>

                        <button
                          className="btn-icon"
                          style={{ padding: '4px' }}
                          onClick={() => handleOpenEditLesson(module.id, lesson)}
                          title="Edit Lesson"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-icon"
                          style={{ padding: '4px' }}
                          onClick={() => handleOpenDelete('lesson', lesson)}
                          title="Delete Lesson"
                        >
                          <Trash2 size={14} color="#EF4444" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Module Create/Edit Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title={selectedModule ? 'Edit Module' : 'Add New Curriculum Module'}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModuleModalOpen(false)} disabled={moduleSaveLoading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveModule} disabled={moduleSaveLoading}>
              {moduleSaveLoading ? 'Saving...' : selectedModule ? 'Save Module' : 'Add Module'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveModule}>
          <div className="form-group">
            <label className="form-label">
              Module Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Module 1: Foundations of High-ROAS Media Buying"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
        </form>
      </Modal>

      {/* Lesson Create/Edit Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={selectedLesson ? 'Edit Lesson' : 'Add Lesson to Module'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setLessonModalOpen(false)} disabled={lessonSaveLoading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveLesson} disabled={lessonSaveLoading}>
              {lessonSaveLoading ? 'Saving...' : selectedLesson ? 'Save Lesson' : 'Add Lesson'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Lesson Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Scaling Meta Ads with Advantage+ & Broad Targeting"
              value={lessonFormData.title}
              onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Duration Display (mm:ss)</label>
              <input
                type="text"
                className="input"
                placeholder="15:30"
                value={lessonFormData.duration}
                onChange={(e) => setLessonFormData({ ...lessonFormData, duration: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Duration in Seconds</label>
              <input
                type="number"
                className="input"
                value={lessonFormData.duration_seconds}
                onChange={(e) => setLessonFormData({ ...lessonFormData, duration_seconds: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Video Stream URL / Asset Key</label>
            <input
              type="url"
              className="input"
              placeholder="https://commondatastorage.googleapis.com/... or HLS/MP4 URL"
              value={lessonFormData.video_url}
              onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
            />
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={lessonFormData.is_preview}
                onChange={(e) => setLessonFormData({ ...lessonFormData, is_preview: e.target.checked })}
              />
              <div className="toggle-slider" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-heading)' }}>
                  Free Preview Lesson
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  Allow unauthenticated users to preview this video lesson without purchase
                </div>
              </div>
            </label>
          </div>
        </form>
      </Modal>

      {/* Item Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, type: null, item: null, loading: false })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteDialogState.type === 'module' ? 'Curriculum Module' : 'Lesson'}`}
        message={`Are you sure you want to permanently delete "${deleteDialogState.item?.title}"? ${deleteDialogState.type === 'module' ? 'All lessons inside this module will also be deleted.' : ''}`}
        confirmText="Delete"
        loading={deleteDialogState.loading}
      />
    </div>
  );
}
