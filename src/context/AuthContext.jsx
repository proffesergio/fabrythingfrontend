import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';
import { TOKEN_KEYS } from '../utils/constants';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAccessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
        const storedRefreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
        const storedUser = localStorage.getItem(TOKEN_KEYS.USER);

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = useCallback(
    async (email, password, confirmPassword, firstName = '', lastName = '') => {
      const result = await authService.register(email, password, confirmPassword, firstName, lastName);
      return result;
    },
    []
  );

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = result.data;
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    const result = await authService.logout(refreshToken);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    return result;
  }, [refreshToken]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      return { success: false, error: 'No refresh token available' };
    }

    const result = await authService.refreshToken(refreshToken);
    if (result.success) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    } else {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
    return result;
  }, [refreshToken]);

  const getProfile = useCallback(async () => {
    const result = await authService.getProfile();
    if (result.success) {
      setUser(result.data);
    }
    return result;
  }, []);

  const isAuthenticated = !!accessToken && !!user;

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    refreshAccessToken,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};