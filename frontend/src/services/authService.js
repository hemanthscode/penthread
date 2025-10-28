import { api } from '../utils';

// Register a new user
export const register = (data) => api.post('/auth/register', data);

// Login user, returns tokens + user info
export const login = (credentials) => api.post('/auth/login', credentials);

// Logout user (token invalidation handled server-side)
export const logout = () => api.post('/auth/logout');

// Refresh token flow
export const refreshToken = (refreshToken) =>
  api.post('/auth/refresh', { refreshToken });

// Get current user profile
export const getProfile = () => api.get('/auth/me');

// Change password for authenticated user
export const changePassword = (data) => api.patch('/auth/change-password', data);

// Forgot password
export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

// Reset password using token
export const resetPassword = (token, newPassword) =>
  api.post('/auth/reset-password', { token, password: newPassword });
