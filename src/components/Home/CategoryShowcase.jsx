import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import styles from './CategoryShowcase.module.css';

const categories = [
  {
    id: 'men',
    name: "Men's Clothing",
    description: 'Premium shirts, pants, and more',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80',
    count: 2500,
  },
  {
    id: 'women',
    name: "Women's Fashion",
    description: 'Elegant dresses, tops, and accessories',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    count: 3500,
  },
  {
    id: 'footwear',
    name: 'Premium Footwear',
    description: 'Quality shoes for every occasion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    count: 1200,
  },
];

const CategoryShowcase = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shop by Category</h2>
          <p className={styles.subtitle}>
            Explore our curated collections
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className={`${styles.card} ${index === 0 ? styles.large : ''}`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={category.image}
                  alt={category.name}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.overlay} />
              </div>

              <div className={styles.content}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDesc}>{category.description}</p>
                <span className={styles.productCount}>
                  {category.count.toLocaleString()}+ Products
                </span>
                <span className={styles.cta}>
                  Shop Now <FiArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
