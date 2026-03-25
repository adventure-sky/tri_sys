import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const login = (userid, pwd) => API.post('/auth/login', { userid, pwd });

const crud = (module) => ({
  getAll: () => API.get(`/${module}`),
  create: (data) => API.post(`/${module}`, data),
  update: (id, data) => API.put(`/${module}/${id}`, data),
  remove: (id) => API.delete(`/${module}/${id}`),
});

export const custApi = crud('cust');
export const factApi = crud('fact');
export const itemApi = crud('item');
export const userApi = crud('user');
