import api from './api';
import storageService from '../utils/storage';

class AuthService {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.tokens) {
      storageService.setAccessToken(response.data.tokens.accessToken);
      storageService.setRefreshToken(response.data.tokens.refreshToken);
      storageService.setUser({
        id: response.data.userId,
        role: response.data.role,
      });
    }
    return response.data;
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      storageService.clearAuth();
    }
  }

  async getProfile() {
    const response = await api.get('/auth/me');
    if (response.data.success) {
      storageService.setUser(response.data.data);
    }
    return response.data;
  }

  async changePassword(passwords) {
    const response = await api.patch('/auth/change-password', passwords);
    return response.data;
  }

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  }

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  isAuthenticated() {
    return !!storageService.getAccessToken();
  }

  getCurrentUser() {
    return storageService.getUser();
  }
}

export default new AuthService();
