import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { instructorsApi } from '../../api/instructors';
import { useToast } from '../../context/ToastContext';

export function CourseFormModal({ isOpen, onClose, onSave, course = null, loading = false }) {
  const isEditing = Boolean(course);
  const toast = useToast();

  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    thumbnail: '',
    instructor_id: '',
    category: 'Performance Marketing',
    price: '4999',
    original_price: '9999',
    duration: '18h 45m',
    level: 'Intermediate to Advanced',
    language: 'English',
    is_published: true,
    is_featured: false,
    is_bestseller: false,
    rating: '4.95',
    total_ratings: 120,
    total_students: 580,
    learning_outcomes: ['Launch and scale Meta Ads campaigns with 3.5x+ ROAS', 'Master Google Performance Max & Search Arbitrage'],
    requirements: ['Basic understanding of digital marketing principles', 'Active Facebook/Meta & Google Ads Manager account'],
  });

  const [outcomeInput, setOutcomeInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');

  // Fetch instructors on open
  useEffect(() => {
    if (isOpen) {
      instructorsApi
        .getInstructors()
        .then((res) => setInstructors(res.results || []))
        .catch(() => {});
    }
  }, [isOpen]);

  // Populate form if editing
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        short_description: course.short_description || '',
        description: course.description || '',
        thumbnail: course.thumbnail || '',
        instructor_id: course.instructor_id || course.instructor?.id || '',
        category: course.category || 'Performance Marketing',
        price: String(course.price ?? '4999'),
        original_price: course.original_price ? String(course.original_price) : '',
        duration: course.duration || '18h 45m',
        level: course.level || 'Intermediate to Advanced',
        language: course.language || 'English',
        is_published: Boolean(course.is_published),
        is_featured: Boolean(course.is_featured),
        is_bestseller: Boolean(course.is_bestseller),
        rating: String(course.rating ?? '4.95'),
        total_ratings: course.total_ratings ?? 0,
        total_students: course.total_students ?? 0,
        learning_outcomes: Array.isArray(course.learning_outcomes) ? course.learning_outcomes : [],
        requirements: Array.isArray(course.requirements) ? course.requirements : [],
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        short_description: '',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        instructor_id: '',
        category: 'Performance Marketing',
        price: '4999',
        original_price: '9999',
        duration: '18h 45m',
        level: 'Intermediate to Advanced',
        language: 'English',
        is_published: true,
        is_featured: false,
        is_bestseller: false,
        rating: '4.95',
        total_ratings: 120,
        total_students: 580,
        learning_outcomes: ['Build high-converting paid media campaigns', 'Scale ROAS profitably with advanced media buying frameworks'],
        requirements: ['Basic digital marketing experience'],
      });
    }
  }, [course, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        learning_outcomes: [...prev.learning_outcomes, outcomeInput.trim()],
      }));
      setOutcomeInput('');
    }
  };

  const removeOutcome = (index) => {
    setFormData((prev) => ({
      ...prev,
      learning_outcomes: prev.learning_outcomes.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Validation Error', 'Course title is required.');
      return;
    }
    if (!formData.price) {
      toast.error('Validation Error', 'Course selling price is required.');
      return;
    }

    const payload = {
      ...formData,
      instructor_id: formData.instructor_id ? Number(formData.instructor_id) : null,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      rating: parseFloat(formData.rating),
      total_ratings: parseInt(formData.total_ratings, 10),
      total_students: parseInt(formData.total_students, 10),
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Masterclass Course' : 'Create New Masterclass Course'}
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving Course...' : isEditing ? 'Save Changes' : 'Create Course'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Title & Slug */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Course Title <span className="required">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="input"
              placeholder="e.g. Performance Marketing & Paid Media Buying Masterclass"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">URL Slug (Auto-generated if empty)</label>
            <input
              type="text"
              name="slug"
              className="input"
              placeholder="performance-marketing-masterclass"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Short Description</label>
          <input
            type="text"
            name="short_description"
            className="input"
            placeholder="Brief tagline for course cards..."
            value={formData.short_description}
            onChange={handleChange}
          />
        </div>

        {/* Full Description */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Full Course Description</label>
          <textarea
            name="description"
            className="textarea"
            placeholder="Detailed course overview and curriculum description..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Instructor, Category, Thumbnail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Instructor</label>
            <select
              name="instructor_id"
              className="select"
              value={formData.instructor_id}
              onChange={handleChange}
            >
              <option value="">-- Select Instructor --</option>
              {instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.name} ({ins.title || 'Instructor'})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="input"
              placeholder="Performance Marketing"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Level</label>
            <select name="level" className="select" value={formData.level} onChange={handleChange}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Intermediate to Advanced">Intermediate to Advanced</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
          </div>
        </div>

        {/* Thumbnail URL */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Thumbnail Image URL</label>
          <input
            type="url"
            name="thumbnail"
            className="input"
            placeholder="https://images.unsplash.com/..."
            value={formData.thumbnail}
            onChange={handleChange}
          />
          {formData.thumbnail && (
            <div style={{ marginTop: '8px' }}>
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                style={{ height: '70px', borderRadius: '6px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        {/* Pricing & Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              Price (₹ INR) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              className="input"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Original Price (₹)</label>
            <input
              type="number"
              name="original_price"
              className="input"
              placeholder="Optional strike-through"
              value={formData.original_price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Duration</label>
            <input
              type="text"
              name="duration"
              className="input"
              placeholder="18h 45m"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Language</label>
            <input
              type="text"
              name="language"
              className="input"
              value={formData.language}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Social Proof & Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Rating (e.g. 4.95)</label>
            <input
              type="number"
              step="0.01"
              name="rating"
              className="input"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Total Ratings Count</label>
            <input
              type="number"
              name="total_ratings"
              className="input"
              value={formData.total_ratings}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Total Students Enrolled</label>
            <input
              type="number"
              name="total_students"
              className="input"
              value={formData.total_students}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Switches: Published, Featured, Bestseller */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <label className="toggle-switch">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
            />
            <div className="toggle-slider" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>Published</span>
          </label>

          <label className="toggle-switch">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
            />
            <div className="toggle-slider" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>Featured Course</span>
          </label>

          <label className="toggle-switch">
            <input
              type="checkbox"
              name="is_bestseller"
              checked={formData.is_bestseller}
              onChange={handleChange}
            />
            <div className="toggle-slider" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-heading)' }}>Bestseller Badge</span>
          </label>
        </div>

        {/* Learning Outcomes Builder */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Learning Outcomes (What You'll Learn)</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              className="input"
              placeholder="e.g. Master Meta Ads & Scaling Frameworks"
              value={outcomeInput}
              onChange={(e) => setOutcomeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={addOutcome}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {formData.learning_outcomes.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                }}
              >
                <span>• {item}</span>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ padding: '4px' }}
                  onClick={() => removeOutcome(idx)}
                >
                  <Trash2 size={13} color="#EF4444" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements Builder */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Prerequisites & Requirements</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              className="input"
              placeholder="e.g. Basic familiarity with ads dashboard"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={addRequirement}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {formData.requirements.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 12px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                }}
              >
                <span>• {item}</span>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ padding: '4px' }}
                  onClick={() => removeRequirement(idx)}
                >
                  <Trash2 size={13} color="#EF4444" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
