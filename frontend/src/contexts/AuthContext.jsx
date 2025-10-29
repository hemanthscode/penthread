import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // start loading true

  // Called on app load to restore session if tokens present
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const profileRes = await authService.getProfile();
          setUser(profileRes.data);
        } catch {
          setUser(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    })();
  }, []);

  // Your login function remains mostly the same
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      const { accessToken, refreshToken } = res.data.tokens ?? {};
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        const profileRes = await authService.getProfile();
        setUser(profileRes.data);
        return profileRes.data;
      }
    } finally {
      setLoading(false);
    }
    return null;
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
