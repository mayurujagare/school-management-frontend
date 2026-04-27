import api from './axios';

export const academicApi = {
  // Grades
  createGrade: (data) => api.post('/academic/grades', data),
  listGrades: (params) => api.get('/academic/grades', { params }),
  getGradeWithSections: (id) => api.get(`/academic/grades/${id}`),
  updateGrade: (id, data) => api.patch(`/academic/grades/${id}`, data),

  // Sections
  createSection: (data) => api.post('/academic/sections', data),
  listAllSections: () => api.get('/academic/sections'),
  listSectionsByGrade: (gradeId) => api.get(`/academic/grades/${gradeId}/sections`),
  updateSection: (id, data) => api.patch(`/academic/sections/${id}`, data),

  // Subjects
  createSubject: (data) => api.post('/academic/subjects', data),
  listSubjects: (params) => api.get('/academic/subjects', { params }),
  updateSubject: (id, data) => api.patch(`/academic/subjects/${id}`, data),

  // Grade-Subject mapping
  listGradeSubjects: (gradeId) => api.get(`/academic/grades/${gradeId}/subjects`),
  assignSubjectToGrade: (gradeId, subjectId, data) =>
    api.post(`/academic/grades/${gradeId}/subjects/${subjectId}`, data),
  removeSubjectFromGrade: (gradeId, subjectId) =>
    api.delete(`/academic/grades/${gradeId}/subjects/${subjectId}`),
};