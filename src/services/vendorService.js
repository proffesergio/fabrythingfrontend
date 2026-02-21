import api from './api';
import AuthService from './authService';

const VENDOR_API_URL = process.env.REACT_APP_VENDOR_API_URL || 'http://localhost:8000/api/vendor';

/**
 * Vendor Service - Handles all vendor-related API calls
 */
class VendorService {
  /**
   * Submit vendor application with multipart/form-data for file uploads
   */
  async submitApplication(formData) {
    const token = AuthService.getAccessToken();
    const response = await fetch(`${VENDOR_API_URL}/applications/`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to submit application');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Get user's application status
   */
  async getApplicationStatus() {
    return api.get('/my-application/my_status/');
  }

  /**
   * Get vendor profile
   */
  async getVendorProfile() {
    return api.get('/profile/me/');
  }

  /**
   * Update vendor profile
   */
  async updateVendorProfile(data) {
    return api.patch('/profile/me/', data);
  }

  /**
   * Get vendor dashboard statistics
   */
  async getVendorStats() {
    return api.get('/stats/');
  }

  /**
   * Get list of all applications (admin only)
   */
  async getApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/applications/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get application details (admin only)
   */
  async getApplicationDetail(id) {
    return api.get(`/applications/${id}/`);
  }

  /**
   * Approve vendor application (admin only)
   */
  async approveApplication(id, notes = '') {
    return api.post(`/applications/${id}/approve/`, { notes });
  }

  /**
   * Reject vendor application (admin only)
   */
  async rejectApplication(id, notes = '') {
    return api.post(`/applications/${id}/reject/`, { notes });
  }

  /**
   * Mark application as under review (admin only)
   */
  async markApplicationReview(id) {
    return api.post(`/applications/${id}/mark_review/`);
  }

  /**
   * Check if user is a vendor
   */
  async checkVendorStatus() {
    try {
      const profile = await this.getVendorProfile();
      return { isVendor: true, isApproved: profile.is_approved, profile };
    } catch (error) {
      if (error.status === 404) {
        return { isVendor: false, isApproved: false, profile: null };
      }
      throw error;
    }
  }

  /**
   * Get vendor's products
   */
  async getVendorProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products/my-products/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Add new product
   */
  async addProduct(productData) {
    return api.post('/products/', productData);
  }

  /**
   * Update product
   */
  async updateProduct(productId, productData) {
    return api.patch(`/products/${productId}/`, productData);
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    return api.delete(`/products/${productId}/`);
  }

  /**
   * Get vendor orders
   */
  async getVendorOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/orders/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Update order status (vendor only)
   */
  async updateOrderStatus(orderId, status) {
    return api.patch(`/orders/${orderId}/`, { status });
  }
}

export default new VendorService();
