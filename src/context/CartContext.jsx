import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import CartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate cart totals
  const calculateTotals = useCallback((items) => {
    const total = items.reduce((sum, item) => {
      const price = item.product?.discount_price || item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setCartCount(count);
  }, []);

  // Fetch cart on mount or when auth changes
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // For guest users, use localStorage
      const localCart = JSON.parse(localStorage.getItem('fabrything_cart') || '[]');
      setCartItems(localCart);
      calculateTotals(localCart);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await CartService.getCart();

      if (response && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        calculateTotals(response.data.items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calculateTotals]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1, variant = null) => {
    if (!isAuthenticated) {
      // Guest user - save to localStorage
      const localCart = JSON.parse(localStorage.getItem('fabrything_cart') || '[]');
      const existingIndex = localCart.findIndex(
        item => item.product_id === product.id && JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      if (existingIndex > -1) {
        localCart[existingIndex].quantity += quantity;
      } else {
        localCart.push({
          product_id: product.id,
          product,
          quantity,
          variant,
        });
      }

      localStorage.setItem('fabrything_cart', JSON.stringify(localCart));
      setCartItems(localCart);
      calculateTotals(localCart);
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await CartService.addItem(product.id, quantity, variant);

      if (response && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        calculateTotals(response.data.items || []);
      }

      return { success: true, data: response };
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calculateTotals]);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem('fabrything_cart') || '[]');
      const updatedCart = localCart.map(item =>
        item.product_id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      localStorage.setItem('fabrything_cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      calculateTotals(updatedCart);
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await CartService.updateItemQuantity(itemId, quantity);

      if (response && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        calculateTotals(response.data.items || []);
      }

      return { success: true };
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calculateTotals]);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId) => {
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem('fabrything_cart') || '[]');
      const updatedCart = localCart.filter(item => item.product_id !== itemId);
      localStorage.setItem('fabrything_cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      calculateTotals(updatedCart);
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await CartService.removeItem(itemId);

      if (response && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        calculateTotals(response.data.items || []);
      }

      return { success: true };
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, calculateTotals]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      localStorage.removeItem('fabrything_cart');
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      await CartService.clearCart();

      setCart(null);
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);

      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Apply coupon
  const applyCoupon = useCallback(async (couponCode) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CartService.applyCoupon(couponCode);

      if (response && response.data) {
        setCart(response.data);
        setCartItems(response.data.items || []);
        calculateTotals(response.data.items || []);
      }

      return { success: true, data: response };
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [calculateTotals]);

  const value = {
    cart,
    cartItems,
    cartCount,
    cartTotal,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
