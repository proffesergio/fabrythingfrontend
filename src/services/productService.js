import api from './api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

/**
 * Product Service
 * Handles all product-related API calls
 */
class ProductService {
  /**
   * Get all products with optional filters
   */
  static async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add filters to query params
      if (params.category) queryParams.append('category', params.category);
      if (params.subcategory) queryParams.append('subcategory', params.subcategory);
      if (params.brand) queryParams.append('brand', params.brand);
      if (params.min_price) queryParams.append('min_price', params.min_price);
      if (params.max_price) queryParams.append('max_price', params.max_price);
      if (params.search) queryParams.append('search', params.search);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const query = queryParams.toString();
      const endpoint = `/products/${query ? `?${query}` : ''}`;

      return await api.get(endpoint);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProduct(id) {
    try {
      return await api.get(`/products/${id}/`);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit = 10) {
    try {
      return await api.get(`/products/featured/?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  /**
   * Get new arrival products
   */
  static async getNewArrivals(limit = 10) {
    try {
      return await api.get(`/products/new-arrivals/?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  }

  /**
   * Get products on sale
   */
  static async getOnSaleProducts(limit = 10) {
    try {
      return await api.get(`/products/on-sale/?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  static async getCategories() {
    try {
      return await api.get('/categories/');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get subcategories by category
   */
  static async getSubcategories(categoryId) {
    try {
      return await api.get(`/categories/${categoryId}/subcategories/`);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  }

  /**
   * Get all brands
   */
  static async getBrands() {
    try {
      return await api.get('/brands/');
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  /**
   * Search products
   */
  static async searchProducts(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      return await ProductService.getProducts(params);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Get related products
   */
  static async getRelatedProducts(productId, limit = 6) {
    try {
      return await api.get(`/products/${productId}/related/?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }

  /**
   * Get product reviews
   */
  static async getProductReviews(productId, page = 1) {
    try {
      return await api.get(`/products/${productId}/reviews/?page=${page}`);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  /**
   * Add product review
   */
  static async addReview(productId, reviewData) {
    try {
      return await api.post(`/products/${productId}/reviews/`, reviewData);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  /**
   * Get product sizes
   */
  static async getSizes() {
    try {
      return await api.get('/products/sizes/');
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw error;
    }
  }

  /**
   * Get product colors
   */
  static async getColors() {
    try {
      return await api.get('/products/colors/');
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw error;
    }
  }
}

export default ProductService;
