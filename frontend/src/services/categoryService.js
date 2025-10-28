import { api } from '../utils';

export const fetchCategories = () => api.get('/categories');

export const fetchCategoryById = (id) => api.get(`/categories/${id}`);

export const createCategory = (data) => api.post('/categories', data);

export const updateCategory = (id, data) => api.patch(`/categories/${id}`, data);

export const deleteCategory = (id) => api.delete(`/categories/${id}`);
