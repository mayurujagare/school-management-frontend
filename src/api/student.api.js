import api from './axios';

export const studentApi = {
  enroll: (data) => api.post('/students', data),
  search: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  update: (id, data) => api.patch(`/students/${id}`, data),
  enrollToSection: (id, data) => api.post(`/students/${id}/enroll`, data),
  listBySection: (sectionId, params) => api.get(`/students/section/${sectionId}`, { params }),
  addParent: (id, data) => api.post(`/students/${id}/parents`, data),
  myChildren: () => api.get('/students/my-children'),
};