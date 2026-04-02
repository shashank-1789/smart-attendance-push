import api from './api';

export const attendanceService = {
  mark: async (date, records) => {
    const response = await api.post('/attendance/mark', { date, records });
    return response.data;
  },

  getReport: async () => {
    const response = await api.get('/attendance/report');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/attendance/dashboard');
    return response.data;
  },
};
