import { apiClient } from './client';

export const settingsApi = {
  getProfile: async () => {
    return apiClient('/admin/profile/', { method: 'GET' });
  },

  updateProfile: async (profileData) => {
    return apiClient('/admin/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return apiClient('/admin/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },
};
