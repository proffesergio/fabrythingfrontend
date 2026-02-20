import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Common/ProductCard';
import { ProductCardSkeleton } from '../Common/Skeleton';
import styles from './FeaturedProducts.module.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock featured products for demo
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
        is_featured: true,
        category: "Women's",
      },
      {
        id: 3,
        name: 'Classic Leather Loafers',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80',
        rating: 4.6,
        review_count: 64,
        is_featured: true,
        category: "Footwear",
      },
      {
        id: 4,
        name: 'Premium Skincare Set',
        price: 79.99,
        discount_price: 59.99,
        image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
        rating: 4.9,
        review_count: 215,
        is_featured: true,
        category: 'Skincare',
      },
      {
        id: 5,
        name: 'Slim Fit Chinos',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80',
        rating: 4.4,
        review_count: 89,
        is_featured: true,
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
        is_featured: true,
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
        is_featured: true,
        category: 'Footwear',
      },
      {
        id: 8,
        name: 'Anti-Aging Serum',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
        rating: 4.6,
        review_count: 178,
        is_featured: true,
        category: 'Skincare',
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  const itemsPerPage = 4;
  const totalSlides = Math.ceil(products.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleProducts = products.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Featured Products</h2>
            <p className={styles.subtitle}>Handpicked selections from top vendors</p>
          </div>

          <div className={styles.navigation}>
            <button
              className={styles.navBtn}
              onClick={prevSlide}
              aria-label="Previous"
            >
              <FiChevronLeft />
            </button>
            <button
              className={styles.navBtn}
              onClick={nextSlide}
              aria-label="Next"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div className={styles.products}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        <div className={styles.footer}>
          <Link to="/products?featured=true" className={styles.viewAll}>
            View All Featured Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
