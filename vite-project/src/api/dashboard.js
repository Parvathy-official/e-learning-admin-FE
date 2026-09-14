import { apiClient } from './client';

export const dashboardApi = {
  getStats: async () => {
    return apiClient('/admin/dashboard/stats/', { method: 'GET' });
  },
};
