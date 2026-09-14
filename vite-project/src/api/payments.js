import { apiClient } from './client';

export const paymentsApi = {
  getPayments: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.course_id) query.append('course_id', params.course_id);
    if (params.user_id) query.append('user_id', params.user_id);
    const queryString = query.toString();
    return apiClient(`/admin/payments/${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getPaymentDetail: async (id) => {
    return apiClient(`/admin/payments/${id}/`, { method: 'GET' });
  },
};
