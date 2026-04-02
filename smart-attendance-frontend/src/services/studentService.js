import api from './api';

export const studentService = {
  getAll: async (search = '', year = '', branch = '') => {
    const params = {};
    if (search) params.search = search;
    if (year) params.year = year;
    if (branch) params.branch = branch;
    const response = await api.get('/students', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (student) => {
    const response = await api.post('/students', student);
    return response.data;
  },

  update: async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/students/${id}`);
  },
};
