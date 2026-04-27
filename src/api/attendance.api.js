import api from './axios';

export const attendanceApi = {
  markBulk: (data) => api.post('/attendance/mark', data),
  getSectionAttendance: (sectionId, params) => api.get(`/attendance/section/${sectionId}`, { params }),
  getSectionRange: (sectionId, params) => api.get(`/attendance/section/${sectionId}/range`, { params }),
  getStudentAttendance: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getStudentSummary: (studentId, params) => api.get(`/attendance/student/${studentId}/summary`, { params }),
  update: (id, data) => api.patch(`/attendance/${id}`, data),
  myChildAttendance: (studentId, params) => api.get(`/attendance/my-child/${studentId}`, { params }),
};