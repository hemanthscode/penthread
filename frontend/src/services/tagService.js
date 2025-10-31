import api from './api';

class TagService {
  async getTags() {
    const response = await api.get('/tags');
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
