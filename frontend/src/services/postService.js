import { api } from '../utils';

export const fetchPosts = (params) => api.get('/posts', { params });

export const fetchPostById = (id) => api.get(`/posts/${id}`);

export const createPost = (data) => api.post('/posts', data);

export const updatePost = (id, data) => api.patch(`/posts/${id}`, data);

export const deletePost = (id) => api.delete(`/posts/${id}`);

export const approvePost = (id) => api.patch(`/posts/${id}/approve`);

export const rejectPost = (id) => api.patch(`/posts/${id}/reject`);

export const publishPost = (id) => api.patch(`/posts/${id}/publish`);

export const unpublishPost = (id) => api.patch(`/posts/${id}/unpublish`);
