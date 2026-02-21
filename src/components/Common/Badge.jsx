import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ type = 'default', text, discount, variant, children }) => {
  // Support both 'type' and 'variant' props for flexibility
  const badgeType = variant || type;

  const getBadgeClass = () => {
    const baseClass = styles.badge;
    return `${baseClass} ${styles[badgeType] || styles.default}`;
  };

  const renderContent = () => {
    if (children) return children;

    switch (badgeType) {
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
      // Order status variants
      case 'warning':
        return text || 'Pending';
      case 'info':
        return text || 'Processing';
      case 'primary':
        return text || 'Shipped';
      case 'success':
        return text || 'Delivered';
      case 'danger':
        return text || 'Cancelled';
      case 'secondary':
        return text || 'Returned';
      default:
        return text || '';
    }
  };

  if (badgeType === 'outofstock') {
    return <span className={getBadgeClass()}>{renderContent()}</span>;
  }

  return <span className={getBadgeClass()}>{renderContent()}</span>;
};

export default Badge;
