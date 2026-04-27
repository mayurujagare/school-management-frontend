import api from './axios';

export const announcementApi = {
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.patch(`/announcements/${id}`, data),
  publish: (id) => api.post(`/announcements/${id}/publish`),
  deleteDraft: (id) => api.delete(`/announcements/${id}`),
  getById: (id) => api.get(`/announcements/${id}`),
  listAll: (params) => api.get('/announcements', { params }),
  getStats: () => api.get('/announcements/stats'),
  parentFeed: (params) => api.get('/announcements/feed', { params }),
  registerDevice: (data) => api.post('/announcements/devices/register', data),
  unregisterDevice: (params) => api.post('/announcements/devices/unregister', null, { params }),
};