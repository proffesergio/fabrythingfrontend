import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ type = 'default', text, discount, children }) => {
  const getBadgeClass = () => {
    const baseClass = styles.badge;
    return `${baseClass} ${styles[type] || styles.default}`;
  };

  const renderContent = () => {
    if (children) return children;

    switch (type) {
      case 'sale':
        return discount ? `-${discount}%` : 'Sale';
      case 'new':
        return 'New';
      case 'featured':
        return 'Featured';
      case 'bestseller':
        return 'Best Seller';
      case 'outofstock':
        return 'Out of Stock';
      case 'limited':
        return 'Limited';
      default:
        return text || '';
    }
  };

  if (type === 'outofstock') {
    return <span className={getBadgeClass()}>{renderContent()}</span>;
  }

  return <span className={getBadgeClass()}>{renderContent()}</span>;
};

export default Badge;
