import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/Common/ProductCard';
import Breadcrumb from '../components/Common/Breadcrumb';
import { ProductCardSkeleton } from '../components/Common/Skeleton';
import styles from './ProductListPage.module.css';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Mock products for demo
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'Premium Cotton Oxford Shirt',
        price: 49.99,
        discount_price: 39.99,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80',
        rating: 4.5,
        review_count: 128,
        is_featured: true,
        category: "Men's",
      },
      {
        id: 2,
        name: 'Elegant Silk Blouse',
        price: 89.99,
        discount_price: 69.99,
        image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
        rating: 4.8,
        review_count: 95,
        category: "Women's",
      },
      {
        id: 3,
        name: 'Classic Leather Loafers',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80',
        rating: 4.6,
        review_count: 64,
        category: 'Footwear',
      },
      {
        id: 4,
        name: 'Premium Skincare Set',
        price: 79.99,
        discount_price: 59.99,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
        rating: 4.9,
        review_count: 215,
        category: 'Skincare',
      },
      {
        id: 5,
        name: 'Slim Fit Chinos',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80',
        rating: 4.4,
        review_count: 89,
        category: "Men's",
      },
      {
        id: 6,
        name: 'Designer Summer Dress',
        price: 99.99,
        discount_price: 79.99,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80',
        rating: 4.7,
        review_count: 156,
        category: "Women's",
      },
      {
        id: 7,
        name: 'Running Sneakers Pro',
        price: 149.99,
        discount_price: 119.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        rating: 4.8,
        review_count: 203,
        category: 'Footwear',
      },
      {
        id: 8,
        name: 'Anti-Aging Serum',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
        rating: 4.6,
        review_count: 178,
        category: 'Skincare',
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, [category, sortBy]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'men', label: "Men's Clothing" },
    { value: 'women', label: "Women's Fashion" },
    { value: 'footwear', label: 'Footwear' },
    { value: 'skincare', label: 'Skincare' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Products', path: '/products' },
          ]}
        />

        <div className={styles.header}>
          <h1 className={styles.title}>All Products</h1>
          <p className={styles.resultCount}>{products.length} products found</p>
        </div>

        <div className={styles.toolbar}>
          <button
            className={styles.filterBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </button>

          <div className={styles.viewMode}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>

          <div className={styles.sortWrapper}>
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.content}>
          {/* Filters Sidebar */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.open : ''}`}>
            <div className={styles.filterHeader}>
              <h3>Filters</h3>
              <button onClick={() => setShowFilters(false)} className={styles.closeBtn}>
                <FiX />
              </button>
            </div>

            <div className={styles.filterSection}>
              <h4>Category</h4>
              <div className={styles.filterOptions}>
                {categories.map((cat) => (
                  <label key={cat.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={category === cat.value}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterSection}>
              <h4>Price Range</h4>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className={styles.priceInput}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className={styles.priceInput}
                  placeholder="Max"
                />
              </div>
            </div>

            <button className={styles.applyBtn}>Apply Filters</button>
          </aside>

          {/* Products Grid */}
          <div className={styles.products}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
