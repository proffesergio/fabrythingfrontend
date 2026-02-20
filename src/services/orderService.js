import api from './api';

/**
 * Order Service
 * Handles all order-related API calls
 */
class OrderService {
  /**
   * Create new order
   */
  static async createOrder(orderData) {
    try {
      return await api.post('/orders/', orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get user's orders
   */
  static async getOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);

      const query = queryParams.toString();
      const endpoint = `/orders/${query ? `?${query}` : ''}`;

      return await api.get(endpoint);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Get single order by ID
   */
  static async getOrder(orderId) {
    try {
      return await api.get(`/orders/${orderId}/`);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Get order by tracking number
   */
  static async getOrderByTracking(trackingNumber) {
    try {
      return await api.get(`/orders/track/${trackingNumber}/`);
    } catch (error) {
      console.error('Error fetching order by tracking:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId, reason) {
    try {
      return await api.post(`/orders/${orderId}/cancel/`, { reason });
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }

  /**
   * Request return
   */
  static async requestReturn(orderId, items, reason) {
    try {
      return await api.post(`/orders/${orderId}/return/`, {
        items,
        reason,
      });
    } catch (error) {
      console.error('Error requesting return:', error);
      throw error;
    }
  }

  /**
   * Get available shipping methods
   */
  static async getShippingMethods() {
    try {
      return await api.get('/orders/shipping-methods/');
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      throw error;
    }
  }

  /**
   * Get available payment methods
   */
  static async getPaymentMethods() {
    try {
      return await api.get('/orders/payment-methods/');
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  /**
   * Initiate payment
   */
  static async initiatePayment(orderId, paymentMethod) {
    try {
      return await api.post(`/orders/${orderId}/initiate-payment/`, {
        payment_method: paymentMethod,
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment
   */
  static async verifyPayment(orderId, paymentData) {
    try {
      return await api.post(`/orders/${orderId}/verify-payment/`, paymentData);
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Get order status
   */
  static async getOrderStatus(orderId) {
    try {
      return await api.get(`/orders/${orderId}/status/`);
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  }

  /**
   * Reorder items from past order
   */
  static async reorder(orderId) {
    try {
      return await api.post(`/orders/${orderId}/reorder/`);
    } catch (error) {
      console.error('Error reordering:', error);
      throw error;
    }
  }
}

export default OrderService;
