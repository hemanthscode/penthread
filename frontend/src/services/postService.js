import api from './api';

class PostService {
  async getPosts(params = {}) {
    const response = await api.get('/posts', { params });
    return response.data;
  }

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  }

  async createPost(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  }

  async updatePost(postId, postData) {
    const response = await api.patch(`/posts/${postId}`, postData);
    return response.data;
  }

  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }

  async approvePost(postId) {
    const response = await api.patch(`/posts/${postId}/approve`);
    return response.data;
  }

  async rejectPost(postId) {
    const response = await api.patch(`/posts/${postId}/reject`);
    return response.data;
  }

  async publishPost(postId) {
    const response = await api.patch(`/posts/${postId}/publish`);
    return response.data;
  }

  async unpublishPost(postId) {
    const response = await api.patch(`/posts/${postId}/unpublish`);
    return response.data;
  }
}

export default new PostService();
