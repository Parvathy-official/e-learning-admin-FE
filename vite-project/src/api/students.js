import { apiClient } from './client';

export const studentsApi = {
  getStudents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    const queryString = query.toString();
    return apiClient(`/admin/students/${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getStudentDetail: async (id) => {
    return apiClient(`/admin/students/${id}/`, { method: 'GET' });
  },

  updateStudent: async (id, data) => {
    return apiClient(`/admin/students/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
