import api from './api';

class TagService {
  async getTags() {
    const { data } = await api.get('/tags');
    return data;
  }

  async getTag(tagId) {
    const { data } = await api.get(`/tags/${tagId}`);
    return data;
  }

  async createTag(tagData) {
    const { data } = await api.post('/tags', tagData);
    return data;
  }

  async updateTag(tagId, tagData) {
    const { data } = await api.patch(`/tags/${tagId}`, tagData);
    return data;
  }

  async deleteTag(tagId) {
    const { data } = await api.delete(`/tags/${tagId}`);
    return data;
  }
}

export default new TagService();