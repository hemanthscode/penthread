import { api } from '../utils';

export const getAllUsers = () => api.get('/users');

export const getUserById = (id) => api.get(`/users/${id}`);

export const updateUser = (id, data) => api.patch(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getMyProfile = () => api.get('/users/profile/me');

export const updateMyProfile = (data) => api.patch('/users/profile/me', data);

export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role });

export const updateUserStatus = (id, isActive) => api.patch(`/users/${id}/status`, { isActive });
