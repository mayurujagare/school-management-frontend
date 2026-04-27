import api from './axios';

export const staffApi = {
  create: (data) => api.post('/staff', data),
  search: (params) => api.get('/staff', { params }),
  getById: (id) => api.get(`/staff/${id}`),
  update: (id, data) => api.patch(`/staff/${id}`, data),
  assign: (data) => api.post('/staff/assign', data),
  getSectionTeachers: (sectionId) => api.get(`/staff/section/${sectionId}`),
  getAssignments: (staffId) => api.get(`/staff/${staffId}/assignments`),
  removeAssignment: (sectionId, staffId) => api.delete(`/staff/section/${sectionId}/staff/${staffId}`),
  myProfile: () => api.get('/staff/me'),
};