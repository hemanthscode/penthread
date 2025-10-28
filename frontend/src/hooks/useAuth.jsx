// src/hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';
import * as authService from '../services/authService';

function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { accessToken, refreshToken, user } = response.data.tokens
      ? { ...response.data.tokens, user: response.data.user }
      : { accessToken: null, refreshToken: null, user: null };
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken');
    if (!token) return;
    try {
      const response = await authService.refreshToken(token);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      if (!user) {
        setUser(response.data.user);
      }
    } catch {
      logout();
    }
  };

  useEffect(() => {
    async function initialize() {
      try {
        const profile = await authService.getProfile();
        setUser(profile.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  return { user, login, logout, refreshToken, loading };
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
