import api from './api';

class PostService {
  // ==================== PUBLIC ====================
  /**
   * Get published posts (accessible to everyone including guests)
   */
  async getPublicPosts(params = {}) {
    const response = await api.get('/posts/public', { params });
    return response.data;
  }

  /**
   * Get single post by ID (accessible to everyone)
   */
  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  }

  // ==================== AUTHOR ====================
  /**
   * Get logged-in author's own posts (all statuses)
   * Requires: author or admin role
   */
  async getMyPosts(params = {}) {
    const response = await api.get('/posts/my-posts', { params });
    return response.data;
  }

  // ==================== ADMIN ====================
  /**
   * Get all posts from all authors (all statuses)
   * Requires: admin role
   */
  async getAllPostsAdmin(params = {}) {
    const response = await api.get('/posts/admin/all', { params });
    return response.data;
  }

  /**
   * Approve a post (change status to 'approved')
   * Requires: admin role
   */
  async approvePost(postId) {
    const response = await api.patch(`/posts/${postId}/approve`);
    return response.data;
  }

  /**
   * Reject a post (change status to 'rejected')
   * Requires: admin role
   */
  async rejectPost(postId) {
    const response = await api.patch(`/posts/${postId}/reject`);
    return response.data;
  }

  // ==================== CRUD ====================
  /**
   * Create a new post (status: 'pending' by default)
   * Requires: author or admin role
   */
  async createPost(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  }

  /**
   * Update a post (must be author of post or admin)
   * Requires: author or admin role
   */
  async updatePost(postId, postData) {
    const response = await api.patch(`/posts/${postId}`, postData);
    return response.data;
  }

  /**
   * Delete a post (must be author of post or admin)
   * Requires: author or admin role
   */
  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  }

  /**
   * Publish a post (change status to 'published')
   * Requires: author or admin role (must own the post)
   */
  async publishPost(postId) {
    const response = await api.patch(`/posts/${postId}/publish`);
    return response.data;
  }

  /**
   * Unpublish a post (change status to 'unpublished')
   * Requires: author or admin role (must own the post)
   */
  async unpublishPost(postId) {
    const response = await api.patch(`/posts/${postId}/unpublish`);
    return response.data;
  }
}

export default new PostService();
