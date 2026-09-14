import { apiClient } from './client';

export const enrollmentsApi = {
  getEnrollments: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.course_id) query.append('course_id', params.course_id);
    if (params.user_id) query.append('user_id', params.user_id);
    const queryString = query.toString();
    return apiClient(`/admin/enrollments/${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getEnrollmentDetail: async (id) => {
    return apiClient(`/admin/enrollments/${id}/`, { method: 'GET' });
  },

  updateEnrollment: async (id, data) => {
    return apiClient(`/admin/enrollments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
