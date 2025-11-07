import api from './api';

class CommentService {
  async getComments(postId, params = {}) {
    // Public route: GET /api/posts/:postId/comments
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  }

  async getPendingComments() {
    // Protected route: GET /api/comments/pending for author/admin
    const response = await api.get('/comments/pending');
    return response.data;
  }

  async createComment(postId, content) {
    // POST /api/posts/:postId/comments
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  }

  async moderateComment(commentId, action) {
    // PATCH /api/comments/:commentId/moderate
    const response = await api.patch(`/comments/${commentId}/moderate`, { action });
    return response.data;
  }

  async deleteComment(commentId) {
    // DELETE /api/comments/:commentId
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
}

export default new CommentService();
