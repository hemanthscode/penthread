import { api } from '../utils';

export const fetchTags = () => api.get('/tags');

export const fetchTagById = (id) => api.get(`/tags/${id}`);

export const createTag = (data) => api.post('/tags', data);

export const updateTag = (id, data) => api.patch(`/tags/${id}`, data);

export const deleteTag = (id) => api.delete(`/tags/${id}`);
