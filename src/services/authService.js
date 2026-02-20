const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

/**
 * Authentication Service
 * Handles all authentication API calls
 */
class AuthService {
  /**
   * Register new user
   */
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens
      if (data.data && data.data.access_token) {
        localStorage.setItem(
          'access_token',
          data.data.access_token
        );
        localStorage.setItem(
          'refresh_token',
          data.data.refresh_token
        );
        localStorage.setItem(
          'user',
          JSON.stringify(data.data.user)
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Refresh failed, logout user
        AuthService.logout();
        throw new Error('Token refresh failed');
      }

      // Update access token
      localStorage.setItem(
        'access_token',
        data.data.access_token
      );

      return data;
    } catch (error) {
      AuthService.logout();
      throw error;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Token might be expired, try to refresh
        if (response.status === 401) {
          await AuthService.refreshToken();
          return AuthService.getCurrentUser();
        }
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  /**
   * Logout user
   */
  static logout() {
    try {
      const token = localStorage.getItem('access_token');

      // Call logout endpoint for logging purposes
      if (token) {
        fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(err => console.error('Logout error:', err));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get stored user
   */
  static getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if user is logged in
   */
  static isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Get access token
   */
  static getAccessToken() {
    return localStorage.getItem('access_token');
  }
}

export default AuthService;