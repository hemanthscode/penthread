import api from './api';

class InteractionService {
  /**
   * Toggle like on a post
   */
  async toggleLike(postId) {
    const response = await api.post(`/interactions/${postId}/like`);
    return response.data;
  }

  /**
   * Toggle favorite on a post
   */
  async toggleFavorite(postId) {
    const response = await api.post(`/interactions/${postId}/favorite`);
    return response.data;
  }

  /**
   * Record a view on a post
   */
  async recordView(postId) {
    const response = await api.post(`/interactions/${postId}/view`);
    return response.data;
  }

  /**
   * Get user's liked posts
   */
  async getLikedPosts(params = {}) {
    const response = await api.get('/interactions/liked', { params });
    return response.data;
  }

  /**
   * Get user's favorited posts
   */
  async getFavoritedPosts(params = {}) {
    const response = await api.get('/interactions/favorited', { params });
    return response.data;
  }
}

export default new InteractionService();
