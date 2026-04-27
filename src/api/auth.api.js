import api from './axios';

export const authApi = {
  staffLogin: (data) => api.post('/auth/login', data),
  requestOtp: (data) => api.post('/auth/otp/request', data),
  verifyOtp: (data) => api.post('/auth/otp/verify', data),
  refresh: (data) => api.post('/auth/refresh', data),
  logout: (data) => api.post('/auth/logout', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};