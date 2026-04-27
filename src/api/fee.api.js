import api from './axios';

export const feeApi = {
  // Categories
  createCategory: (data) => api.post('/fees/categories', data),
  listCategories: () => api.get('/fees/categories'),

  // Structures
  createStructure: (data) => api.post('/fees/structures', data),
  listStructures: (params) => api.get('/fees/structures', { params }),

  // Discounts
  createDiscount: (params) => api.post('/fees/discounts', null, { params }),
  listDiscounts: () => api.get('/fees/discounts'),

  // Ledger
  generateLedger: (data) => api.post('/fees/ledger/generate', data),
  getStudentFees: (studentId, params) => api.get(`/fees/ledger/student/${studentId}`, { params }),
  applyDiscount: (data) => api.post('/fees/ledger/discount', data),
  waiveFee: (data) => api.post('/fees/ledger/waive', data),
  getOverdue: () => api.get('/fees/ledger/overdue'),

  // Payments
  recordPayment: (data) => api.post('/fees/payments', data),
  getReceipt: (receiptNo) => api.get(`/fees/receipts/${receiptNo}`),
  getStudentPayments: (studentId) => api.get(`/fees/payments/student/${studentId}`),
  getDailyReport: (params) => api.get('/fees/reports/daily', { params }),

  // Parent
  myChildFees: (studentId) => api.get(`/fees/my-child/${studentId}`),
};