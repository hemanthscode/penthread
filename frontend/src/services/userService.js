import api from './api';

class UserService {
  async getUsers() {
    const response = await api.get('/users');
    return response.data;
  }

  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId, userData) {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  }

  async getMyProfile() {
    const response = await api.get('/users/profile/me');
    return response.data;
  }

  async updateMyProfile(profileData) {
    const response = await api.patch('/users/profile/me', profileData);
    return response.data;
  }

  async updateUserRole(userId, role) {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  }

  async updateUserStatus(userId, isActive) {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  }
}

export default new UserService();
