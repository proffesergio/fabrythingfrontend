import api from './api';
import { API_ENDPOINTS, TOKEN_KEYS } from '../utils/constants';

export const authService = {
  register: async (email, password, confirmPassword, firstName = '', lastName = '') => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem(TOKEN_KEYS.ACCESS, access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, refresh_token);
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));

      return {
        success: true,
        data: { accessToken: access_token, refreshToken: refresh_token, user },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  logout: async (refreshToken) => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh_token: refreshToken,
      });
      localStorage.removeItem(TOKEN_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_KEYS.REFRESH);
      localStorage.removeItem(TOKEN_KEYS.USER);
      return { success: true };
    } catch (error) {
      localStorage.removeItem(TOKEN_KEYS.ACCESS);
      localStorage.removeItem(TOKEN_KEYS.REFRESH);
      localStorage.removeItem(TOKEN_KEYS.USER);
      return { success: false, error: error.response?.data?.error || 'Logout failed' };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken,
      });
      const { access_token, refresh_token: newRefreshToken } = response.data;

      localStorage.setItem(TOKEN_KEYS.ACCESS, access_token);
      localStorage.setItem(TOKEN_KEYS.REFRESH, newRefreshToken);

      return {
        success: true,
        data: { accessToken: access_token, refreshToken: newRefreshToken },
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Token refresh failed',
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      const user = response.data.user;
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
      return { success: true, data: user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch profile',
      };
    }
  },
};

export default authService;