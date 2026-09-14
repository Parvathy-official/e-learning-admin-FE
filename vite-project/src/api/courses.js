import { apiClient } from './client';

export const coursesApi = {
  getCourses: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.is_published !== undefined && params.is_published !== '') query.append('is_published', params.is_published);
    if (params.is_featured !== undefined && params.is_featured !== '') query.append('is_featured', params.is_featured);
    if (params.is_bestseller !== undefined && params.is_bestseller !== '') query.append('is_bestseller', params.is_bestseller);
    if (params.instructor_id) query.append('instructor_id', params.instructor_id);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    return apiClient(`/admin/courses/${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  getCourse: async (id) => {
    return apiClient(`/admin/courses/${id}/`, { method: 'GET' });
  },

  createCourse: async (courseData) => {
    return apiClient('/admin/courses/', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  updateCourse: async (id, courseData) => {
    return apiClient(`/admin/courses/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  deleteCourse: async (id) => {
    return apiClient(`/admin/courses/${id}/`, { method: 'DELETE' });
  },

  togglePublish: async (id) => {
    return apiClient(`/admin/courses/${id}/toggle-publish/`, { method: 'POST' });
  },

  toggleFeatured: async (id) => {
    return apiClient(`/admin/courses/${id}/toggle-featured/`, { method: 'POST' });
  },

  toggleBestseller: async (id) => {
    return apiClient(`/admin/courses/${id}/toggle-bestseller/`, { method: 'POST' });
  },

  // Curriculum
  getCurriculum: async (courseId) => {
    return apiClient(`/admin/courses/${courseId}/curriculum/`, { method: 'GET' });
  },

  createModule: async (courseId, moduleData) => {
    return apiClient(`/admin/courses/${courseId}/modules/`, {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  },

  updateModule: async (moduleId, moduleData) => {
    return apiClient(`/admin/modules/${moduleId}/`, {
      method: 'PUT',
      body: JSON.stringify(moduleData),
    });
  },

  deleteModule: async (moduleId) => {
    return apiClient(`/admin/modules/${moduleId}/`, { method: 'DELETE' });
  },

  reorderModules: async (courseId, orders) => {
    return apiClient(`/admin/courses/${courseId}/modules/reorder/`, {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
  },

  createLesson: async (moduleId, lessonData) => {
    return apiClient(`/admin/modules/${moduleId}/lessons/`, {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  },

  updateLesson: async (lessonId, lessonData) => {
    return apiClient(`/admin/lessons/${lessonId}/`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    });
  },

  deleteLesson: async (lessonId) => {
    return apiClient(`/admin/lessons/${lessonId}/`, { method: 'DELETE' });
  },

  reorderLessons: async (moduleId, orders) => {
    return apiClient(`/admin/modules/${moduleId}/lessons/reorder/`, {
      method: 'POST',
      body: JSON.stringify({ orders }),
    });
  },
};
