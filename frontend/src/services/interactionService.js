import api from './api';

class InteractionService {
  async toggleLike(postId) {
    const response = await api.post(`/interactions/${postId}/like`);
    return response.data;
  }

  async toggleFavorite(postId) {
    const response = await api.post(`/interactions/${postId}/favorite`);
    return response.data;
  }

  async recordView(postId) {
    const response = await api.post(`/interactions/${postId}/view`);
    return response.data;
  }
}

export default new InteractionService();
