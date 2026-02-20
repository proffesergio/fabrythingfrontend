import AuthService from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1/auth';

/**
 * API Client with automatic token handling
 * Handles JWT token refresh automatically on 401
 */
class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  /**
   * Make API request with automatic token handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = AuthService.getAccessToken();

    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - Token expired
      if (response.status === 401 && token) {
        // Prevent multiple refresh requests
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshPromise = AuthService.refreshToken()
            .then(() => {
              this.isRefreshing = false;
              this.refreshPromise = null;
              return true;
            })
            .catch(() => {
              this.isRefreshing = false;
              this.refreshPromise = null;
              AuthService.logout();
              window.location.href = '/login';
              return false;
            });
        }

        // Wait for refresh to complete
        const refreshed = await this.refreshPromise;

        if (refreshed) {
          // Retry original request with new token
          const newToken = AuthService.getAccessToken();
          headers['Authorization'] = `Bearer ${newToken}`;

          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    const response = await this.request(endpoint, {
      ...options,
      method: 'GET',
    });

    return this._handleResponse(response);
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    const response = await this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });

    return this._handleResponse(response);
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const response = await this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return this._handleResponse(response);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    const response = await this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    return this._handleResponse(response);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    const response = await this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });

    return this._handleResponse(response);
  }

  /**
   * Handle response
   */
  async _handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(
        data.message || 'An error occurred'
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }
}

// Export singleton instance
export default new APIClient();