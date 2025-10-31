import api from './api';

class ActivityService {
  async getActivities() {
    const response = await api.get('/activity');
    return response.data;
  }
}

export default new ActivityService();
