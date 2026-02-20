import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../Common/ProductCard';
import { ProductCardSkeleton } from '../Common/Skeleton';
import styles from './NewArrivals.module.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock new arrival products for demo
  useEffect(() => {
    const mockProducts = [
      {
        id: 9,
        name: 'Linen Blend Shirt',
        price: 54.99,
        discount_price: 44.99,
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80',
        rating: 4.3,
        review_count: 42,
        is_new: true,
        category: "Men's",
      },
      {
        id: 10,
        name: 'Floral Print Midi Dress',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
        rating: 4.6,
        review_count: 78,
        is_new: true,
        category: "Women's",
      },
      {
        id: 11,
        name: 'Canvas Sneakers',
        price: 69.99,
        discount_price: 54.99,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80',
        rating: 4.5,
        review_count: 156,
        is_new: true,
        category: 'Footwear',
      },
      {
        id: 12,
        name: 'Hydrating Face Mask Set',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
        rating: 4.7,
        review_count: 89,
        is_new: true,
        category: 'Skincare',
      },
      {
        id: 13,
        name: 'Denim Jacket Classic',
        price: 89.99,
        discount_price: 74.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80',
        rating: 4.4,
        review_count: 67,
        is_new: true,
        category: "Men's",
      },
      {
        id: 14,
        name: 'Cashmere Sweater',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80',
        rating: 4.9,
        review_count: 112,
        is_new: true,
        category: "Women's",
      },
      {
        id: 15,
        name: 'Leather Chelsea Boots',
        price: 179.99,
        discount_price: 149.99,
        image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=80',
        rating: 4.8,
        review_count: 94,
        is_new: true,
        category: 'Footwear',
      },
      {
        id: 16,
        name: 'Vitamin C Brightening Cream',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
        rating: 4.5,
        review_count: 201,
        is_new: true,
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
            <h2 className={styles.title}>New Arrivals</h2>
            <p className={styles.subtitle}>Fresh picks just landed</p>
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
          <Link to="/products?sort=newest" className={styles.viewAll}>
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
