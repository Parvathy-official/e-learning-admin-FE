import { apiClient, setTokens, clearTokens } from './client';

export const authApi = {
  login: async (email, password) => {
    const data = await apiClient('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access && data.refresh) {
      setTokens(data.access, data.refresh);
      localStorage.setItem('learnflow_admin_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    try {
      await apiClient('/auth/logout/', { method: 'POST' });
    } catch {
      // Ignore errors on logout
    } finally {
      clearTokens();
    }
  },

  getMe: async () => {
    const data = await apiClient('/auth/me/', { method: 'GET' });
    if (data) {
      localStorage.setItem('learnflow_admin_user', JSON.stringify(data));
    }
    return data;
  },
};
