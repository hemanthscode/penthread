import { api } from '../utils';

export const fetchCommentsByPost = (postId) => api.get(`/comments/posts/${postId}/comments`);

export const addComment = (postId, data) => api.post(`/comments/posts/${postId}/comments`, data);

export const moderateComment = (commentId, action) =>
  api.patch(`/comments/comments/${commentId}/moderate`, { action });

export const deleteComment = (commentId) => api.delete(`/comments/comments/${commentId}`);
