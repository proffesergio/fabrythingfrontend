import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import WishlistService from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      // For guest users, use localStorage
      const localWishlist = JSON.parse(localStorage.getItem('fabrything_wishlist') || '[]');
      setWishlistItems(localWishlist);
      setWishlistCount(localWishlist.length);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await WishlistService.getWishlist();

      if (response && response.data) {
        setWishlistItems(response.data.items || []);
        setWishlistCount(response.data.items?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item =>
      item.product?.id === productId || item.product_id === productId
    );
  }, [wishlistItems]);

  // Add to wishlist
  const addToWishlist = useCallback(async (product) => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem('fabrything_wishlist') || '[]');
      const exists = localWishlist.some(item => item.product_id === product.id);

      if (!exists) {
        localWishlist.push({
          product_id: product.id,
          product,
          added_at: new Date().toISOString(),
        });
        localStorage.setItem('fabrything_wishlist', JSON.stringify(localWishlist));
        setWishlistItems(localWishlist);
        setWishlistCount(localWishlist.length);
      }
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await WishlistService.addItem(product.id);

      if (response && response.data) {
        setWishlistItems(response.data.items || []);
        setWishlistCount(response.data.items?.length || 0);
      }

      return { success: true, data: response };
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem('fabrything_wishlist') || '[]');
      const updatedWishlist = localWishlist.filter(item => item.product_id !== productId);
      localStorage.setItem('fabrything_wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      setWishlistCount(updatedWishlist.length);
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await WishlistService.removeItem(productId);

      if (response && response.data) {
        setWishlistItems(response.data.items || []);
        setWishlistCount(response.data.items?.length || 0);
      }

      return { success: true };
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Toggle wishlist item
  const toggleWishlist = useCallback(async (product) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  }, [isInWishlist, removeFromWishlist, addToWishlist]);

  // Move item to cart
  const moveToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await WishlistService.moveToCart(productId, quantity);

      if (response && response.data) {
        setWishlistItems(response.data.items || []);
        setWishlistCount(response.data.items?.length || 0);
      }

      return { success: true, data: response };
    } catch (err) {
      console.error('Error moving to cart:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      localStorage.removeItem('fabrything_wishlist');
      setWishlistItems([]);
      setWishlistCount(0);
      return { success: true };
    }

    try {
      setLoading(true);
      setError(null);
      await WishlistService.clearWishlist();

      setWishlistItems([]);
      setWishlistCount(0);

      return { success: true };
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    error,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
    clearWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
