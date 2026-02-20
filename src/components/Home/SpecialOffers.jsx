import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import styles from './SpecialOffers.module.css';

const SpecialOffers = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <span className={styles.tag}>Limited Time Offer</span>
            <h2 className={styles.title}>Get 25% Off</h2>
            <p className={styles.description}>
              On all premium skincare products this week.
              Use code: SKINCARE25
            </p>
            <Link to="/products?category=skincare&sale=true" className={styles.cta}>
              Shop Now <FiArrowRight />
            </Link>
          </div>
          <div className={styles.image}>
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
              alt="Special Offer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
