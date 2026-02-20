import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.tagline}>Premium Quality • Verified Products</span>
          <h1 className={styles.title}>
            Discover
            <br />
            <span className={styles.highlight}>Premium Fashion</span>
          </h1>
          <p className={styles.description}>
            Explore our curated collection of men's and women's clothing,
            premium footwear, and skincare products from quality-verified vendors.
          </p>

          <div className={styles.actions}>
            <Link to="/products" className={styles.primaryBtn}>
              Shop Now
              <FiArrowRight />
            </Link>
            <Link to="/vendors" className={styles.secondaryBtn}>
              Become a Vendor
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Vendors</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50K+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="Premium Fashion"
              className={styles.image}
            />
          </div>
          <div className={styles.floatingBadge}>
            <span className={styles.badgeIcon}>✓</span>
            <div className={styles.badgeText}>
              <strong>Quality Verified</strong>
              <span>Every product inspected</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll to explore</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
};

export default HeroSection;
