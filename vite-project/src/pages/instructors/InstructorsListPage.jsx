import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, GraduationCap, BookOpen } from 'lucide-react';
import { instructorsApi } from '../../api/instructors';
import { InstructorFormModal } from './InstructorFormModal';
import { InstructorDetailDrawer } from './InstructorDetailDrawer';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export function InstructorsListPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals & Drawers
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailInstructorId, setDetailInstructorId] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();

  const loadInstructors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await instructorsApi.getInstructors({ search });
      setInstructors(res.results || []);
    } catch (err) {
      toast.error('Failed to load instructors', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    loadInstructors();
  }, [loadInstructors]);

  const handleOpenCreate = () => {
    setSelectedInstructor(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (ins) => {
    setSelectedInstructor(ins);
    setModalOpen(true);
  };

  const handleOpenDetail = (id) => {
    setDetailInstructorId(id);
    setDrawerOpen(true);
  };

  const handleSaveInstructor = async (formData) => {
    setSaveLoading(true);
    try {
      if (selectedInstructor) {
        await instructorsApi.updateInstructor(selectedInstructor.id, formData);
        toast.success('Instructor Updated', `Updated "${formData.name}"`);
      } else {
        await instructorsApi.createInstructor(formData);
        toast.success('Instructor Added', `Added "${formData.name}"`);
      }
      setModalOpen(false);
      loadInstructors();
    } catch (err) {
      toast.error('Failed to save instructor', err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleOpenDelete = (ins) => {
    setInstructorToDelete(ins);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    setDeleteLoading(true);
    try {
      await instructorsApi.deleteInstructor(instructorToDelete.id);
      toast.success('Instructor Deleted', `Deleted "${instructorToDelete.name}"`);
      setDeleteConfirmOpen(false);
      setInstructorToDelete(null);
      loadInstructors();
    } catch (err) {
      toast.error('Failed to delete instructor', err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-info">
          <h1>Instructor Management</h1>
          <p className="page-subtitle">
            Academy instructors, growth architects, and masterclass assignments
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>Add Instructor</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="filter-bar">
        <div className="filter-group" style={{ flex: 1, minWidth: '260px' }}>
          <div className="input-icon-wrapper" style={{ width: '100%', maxWidth: '340px' }}>
            <Search size={16} className="input-icon-left" />
            <input
              type="text"
              className="input"
              placeholder="Search by instructor name or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={3} cols={6} />
      ) : instructors.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No instructors registered"
          actionText="Add Instructor"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Title / Role</th>
                <th>Bio Summary</th>
                <th>Assigned Courses</th>
                <th>Created Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((ins) => (
                <tr key={ins.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}>
                        {ins.avatar ? (
                          <img src={ins.avatar} alt={ins.name} />
                        ) : (
                          <span>{ins.name?.charAt(0)?.toUpperCase() || 'I'}</span>
                        )}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                        {ins.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--primary-light)', fontSize: '0.825rem', fontWeight: 500 }}>
                      {ins.title || 'Instructor'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.775rem', maxWidth: '240px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ins.bio || 'No bio provided'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={14} color="var(--primary)" />
                      <strong>{ins.courses_count || 0}</strong> courses
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ins.created_at || 'N/A'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenDetail(ins.id)}
                        title="View Profile"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenEdit(ins)}
                        title="Edit Instructor"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenDelete(ins)}
                        title="Delete Instructor"
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

      {/* Form Modal */}
      <InstructorFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveInstructor}
        instructor={selectedInstructor}
        loading={saveLoading}
      />

      {/* Detail Drawer */}
      <InstructorDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        instructorId={detailInstructorId}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Instructor"
        message={`Are you sure you want to delete "${instructorToDelete?.name}"? Assigned courses will have their instructor set to unassigned.`}
        confirmText="Delete Instructor"
        loading={deleteLoading}
      />
    </div>
  );
}
