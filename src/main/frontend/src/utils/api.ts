import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true, // Necessario per il refresh token
});

// Interceptor per aggiungere automaticamente il token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const excludedPaths = ['/auth', '/aifa'];

    if (accessToken && !excludedPaths.some(path => config.url?.startsWith(path))) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
