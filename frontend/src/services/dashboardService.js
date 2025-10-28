import { api } from '../utils';

export const fetchAdminSummary = () => api.get('/dashboard/admin/summary');

export const fetchAdminStats = () => api.get('/dashboard/admin/stats');

export const fetchAuthorSummary = () => api.get('/dashboard/author/summary');

export const fetchAuthorStats = () => api.get('/dashboard/author/stats');

export const fetchUserSummary = () => api.get('/dashboard/user/summary');
