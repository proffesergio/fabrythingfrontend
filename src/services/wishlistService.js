import api from './api';

/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */
class WishlistService {
  /**
   * Get user's wishlist
   */
  static async getWishlist() {
    try {
      return await api.get('/wishlist/');
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  /**
   * Add item to wishlist
   */
  static async addItem(productId) {
    try {
      return await api.post('/wishlist/items/', { product_id: productId });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  /**
   * Remove item from wishlist
   */
  static async removeItem(productId) {
    try {
      return await api.delete(`/wishlist/items/${productId}/`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  /**
   * Check if product is in wishlist
   */
  static async checkItem(productId) {
    try {
      return await api.get(`/wishlist/check/${productId}/`);
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  }

  /**
   * Clear entire wishlist
   */
  static async clearWishlist() {
    try {
      return await api.delete('/wishlist/clear/');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  /**
   * Move item to cart
   */
  static async moveToCart(productId, quantity = 1) {
    try {
      return await api.post(`/wishlist/items/${productId}/move-to-cart/`, {
        quantity,
      });
    } catch (error) {
      console.error('Error moving to cart:', error);
      throw error;
    }
  }

  /**
   * Get wishlist count
   */
  static async getWishlistCount() {
    try {
      return await api.get('/wishlist/count/');
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      throw error;
    }
  }
}

export default WishlistService;
