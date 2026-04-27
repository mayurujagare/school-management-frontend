import api from './axios';

export const examApi = {
  // Grading scales
  createScale: (data) => api.post('/exams/grading-scales', data),
  listScales: () => api.get('/exams/grading-scales'),
  getScale: (id) => api.get(`/exams/grading-scales/${id}`),

  // Exam types
  createExamType: (data) => api.post('/exams/types', data),
  listExamTypes: () => api.get('/exams/types'),

  // Exams
  createExam: (data) => api.post('/exams', data),
  listExams: (params) => api.get('/exams', { params }),
  getExam: (id) => api.get(`/exams/${id}`),
  updateExam: (id, data) => api.patch(`/exams/${id}`, data),

  // Marks
  enterMarks: (data) => api.post('/exams/marks', data),
  getResults: (examId) => api.get(`/exams/${examId}/results`),
  getReportCard: (studentId, params) => api.get(`/exams/report-card/${studentId}`, { params }),
  myChildReport: (studentId, params) => api.get(`/exams/my-child/${studentId}/report-card`, { params }),
};