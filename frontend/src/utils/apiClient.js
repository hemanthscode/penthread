import axios from 'axios';

// Base URL comes from .env (Vite auto-injects VITE_ prefixed vars)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  withCredentials: true
});

// Intercept to add JWT from localStorage if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// Optional: handle 401/refresh logic here or with hooks/context

export default api;
