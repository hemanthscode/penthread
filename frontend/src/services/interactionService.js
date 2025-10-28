import { api } from '../utils';

export const likePost = (postId) => api.post(`/interactions/${postId}/like`);

export const unlikePost = (postId) => api.delete(`/interactions/${postId}/like`);

export const favoritePost = (postId) => api.post(`/interactions/${postId}/favorite`);

export const unfavoritePost = (postId) => api.delete(`/interactions/${postId}/favorite`);

export const recordView = (postId) => api.post(`/interactions/${postId}/view`);
