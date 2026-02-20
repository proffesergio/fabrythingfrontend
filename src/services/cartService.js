import api from './api';

/**
 * Cart Service
 * Handles all cart-related API calls
 */
class CartService {
  /**
   * Get user's cart
   */
  static async getCart() {
    try {
      return await api.get('/cart/');
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  /**
   * Add item to cart
   */
  static async addItem(productId, quantity = 1, variant = null) {
    try {
      const data = {
        product_id: productId,
        quantity,
      };

      if (variant) {
        data.variant = variant;
      }

      return await api.post('/cart/items/', data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateItemQuantity(itemId, quantity) {
    try {
      return await api.patch(`/cart/items/${itemId}/`, { quantity });
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  static async removeItem(itemId) {
    try {
      return await api.delete(`/cart/items/${itemId}/`);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   */
  static async clearCart() {
    try {
      return await api.delete('/cart/clear/');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Apply coupon code
   */
  static async applyCoupon(couponCode) {
    try {
      return await api.post('/cart/apply-coupon/', { code: couponCode });
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  /**
   * Remove coupon
   */
  static async removeCoupon() {
    try {
      return await api.delete('/cart/coupon/');
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }

  /**
   * Get cart count
   */
  static async getCartCount() {
    try {
      const response = await api.get('/cart/count/');
      return response;
    } catch (error) {
      console.error('Error fetching cart count:', error);
      throw error;
    }
  }

  /**
   * Estimate shipping
   */
  static async estimateShipping(addressId) {
    try {
      return await api.post('/cart/estimate-shipping/', { address_id: addressId });
    } catch (error) {
      console.error('Error estimating shipping:', error);
      throw error;
    }
  }
}

export default CartService;
