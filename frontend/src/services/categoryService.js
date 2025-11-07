import api from './api';

class CategoryService {
  async getCategories() {
    const { data } = await api.get('/categories');
    return data;
  }

  async getCategory(categoryId) {
    const { data } = await api.get(`/categories/${categoryId}`);
    return data;
  }

  async createCategory(categoryData) {
    const { data } = await api.post('/categories', categoryData);
    return data;
  }

  async updateCategory(categoryId, categoryData) {
    const { data } = await api.patch(`/categories/${categoryId}`, categoryData);
    return data;
  }

  async deleteCategory(categoryId) {
    const { data } = await api.delete(`/categories/${categoryId}`);
    return data;
  }
}

export default new CategoryService();