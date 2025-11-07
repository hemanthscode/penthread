import api from './api';

class ActivityService {
  async getActivities(params = {}) {
    // params can have page, limit for pagination
    const response = await api.get('/activity', { params });
    return response.data;
  }

  async getRecentActivities(params = {}) {
    // params like limit
    const response = await api.get('/activity/recent', { params });
    return response.data;
  }
}

export default new ActivityService();
