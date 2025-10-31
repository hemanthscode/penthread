// src/services/commentService.js
import api from './api';

class CommentService {
  async getComments(postId) {
    const response = await api.get(`/comments/posts/${postId}/comments`);
    return response.data;
  }

  async createComment(postId, content) {
    const response = await api.post(`/comments/posts/${postId}/comments`, { content });
    return response.data;
  }

  async moderateComment(commentId, action) {
    const response = await api.patch(`/comments/comments/${commentId}/moderate`, { action });
    return response.data;
  }

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/comments/${commentId}`);
    return response.data;
  }
}

export default new CommentService();
