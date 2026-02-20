import React from 'react';
import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';
import styles from './ValueProposition.module.css';

const features = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'On orders over $50',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    description: 'Dedicated support team',
  },
];

const ValueProposition = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <div className={styles.iconWrapper}>
                <feature.icon className={styles.icon} />
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{feature.title}</h3>
                <p className={styles.description}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
