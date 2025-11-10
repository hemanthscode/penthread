import api from './api';

class TagService {
  async getTags(params = {}) {
    const response = await api.get('/tags', { params });
    return response.data;
  }

  async getPopularTags(limit = 10) {
    const response = await api.get('/tags/popular', { params: { limit } });
    return response.data;
  }

  async getTag(tagId) {
    const response = await api.get(`/tags/${tagId}`);
    return response.data;
  }

  async createTag(tagData) {
    const response = await api.post('/tags', tagData);
    return response.data;
  }

  async updateTag(tagId, tagData) {
    const response = await api.patch(`/tags/${tagId}`, tagData);
    return response.data;
  }

  async deleteTag(tagId) {
    const response = await api.delete(`/tags/${tagId}`);
    return response.data;
  }
}

export default new TagService();