import api from './api';

class DashboardService {
  async getAdminSummary() {
    const response = await api.get('/dashboard/admin/summary');
    return response.data;
  }

  async getAdminStats() {
    const response = await api.get('/dashboard/admin/stats');
    return response.data;
  }

  async getAuthorSummary() {
    const response = await api.get('/dashboard/author/summary');
    return response.data;
  }

  async getAuthorStats() {
    const response = await api.get('/dashboard/author/stats');
    return response.data;
  }

  async getUserSummary() {
    const response = await api.get('/dashboard/user/summary');
    return response.data;
  }
}

export default new DashboardService();
