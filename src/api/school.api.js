import api from './axios';

export const schoolApi = {
  // Super Admin
  onboardSchool: (data) => api.post('/super-admin/schools', data),
  listSchools: (params) => api.get('/super-admin/schools', { params }),
  getSchoolById: (id) => api.get(`/super-admin/schools/${id}`),
  toggleStatus: (id) => api.patch(`/super-admin/schools/${id}/toggle-status`),
  updateSubscription: (id, data) => api.patch(`/super-admin/schools/${id}/subscription`, data),
  getPlatformStats: () => api.get('/super-admin/stats'),

  // School Admin
  getMySchool: () => api.get('/schools/me'),
  updateMySchool: (data) => api.patch('/schools/me', data),
  getConfigs: () => api.get('/schools/me/config'),
  setConfig: (data) => api.post('/schools/me/config', data),
  bulkSetConfigs: (data) => api.post('/schools/me/config/bulk', data),

  // Academic Years
  listAcademicYears: () => api.get('/schools/me/academic-years'),
  getCurrentYear: () => api.get('/schools/me/academic-years/current'),
  createAcademicYear: (data) => api.post('/schools/me/academic-years', data),
  setCurrentYear: (id) => api.patch(`/schools/me/academic-years/${id}/set-current`),
};