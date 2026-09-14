import { apiClient } from './client';

export const instructorsApi = {
  getInstructors: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    const queryString = query.toString();
    return apiClient(`/admin/instructors/${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getInstructorDetail: async (id) => {
    return apiClient(`/admin/instructors/${id}/`, { method: 'GET' });
  },

  createInstructor: async (data) => {
    return apiClient('/admin/instructors/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateInstructor: async (id, data) => {
    return apiClient(`/admin/instructors/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteInstructor: async (id) => {
    return apiClient(`/admin/instructors/${id}/`, { method: 'DELETE' });
  },
};
