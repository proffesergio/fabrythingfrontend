import api from './api';

/**
 * Address Service
 * Handles all address-related API calls
 */
class AddressService {
  /**
   * Get user's addresses
   */
  static async getAddresses() {
    try {
      return await api.get('/addresses/');
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  /**
   * Get single address by ID
   */
  static async getAddress(id) {
    try {
      return await api.get(`/addresses/${id}/`);
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  }

  /**
   * Add new address
   */
  static async addAddress(addressData) {
    try {
      return await api.post('/addresses/', addressData);
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  /**
   * Update address
   */
  static async updateAddress(id, addressData) {
    try {
      return await api.put(`/addresses/${id}/`, addressData);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  /**
   * Delete address
   */
  static async deleteAddress(id) {
    try {
      return await api.delete(`/addresses/${id}/`);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  /**
   * Set default address
   */
  static async setDefaultAddress(id) {
    try {
      return await api.patch(`/addresses/${id}/set-default/`);
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  /**
   * Get countries
   */
  static async getCountries() {
    try {
      return await api.get('/addresses/countries/');
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  /**
   * Get states/cities by country
   */
  static async getStates(countryCode) {
    try {
      return await api.get(`/addresses/countries/${countryCode}/states/`);
    } catch (error) {
      console.error('Error fetching states:', error);
      throw error;
    }
  }

  /**
   * Validate address
   */
  static async validateAddress(addressData) {
    try {
      return await api.post('/addresses/validate/', addressData);
    } catch (error) {
      console.error('Error validating address:', error);
      throw error;
    }
  }
}

export default AddressService;
