import api from './api';

class CategoryService {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }

  async getCategory(categoryId) {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  }

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }

  async updateCategory(categoryId, categoryData) {
    const response = await api.patch(`/categories/${categoryId}`, categoryData);
    return response.data;
  }

  async deleteCategory(categoryId) {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  }
}

export default new CategoryService();
