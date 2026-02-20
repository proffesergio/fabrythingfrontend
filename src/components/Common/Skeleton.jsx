import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  borderRadius = '4px',
  className = '',
  ...props
}) => {
  const style = {
    width: width || '100%',
    height: height || '20px',
    borderRadius: variant === 'circular' ? '50%' : borderRadius,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className={styles.productCard}>
    <Skeleton height="200px" />
    <div className={styles.productCardContent}>
      <Skeleton width="60%" height="14px" />
      <Skeleton width="80%" height="16px" />
      <Skeleton width="40%" height="14px" />
    </div>
  </div>
);

// Text Skeleton
export const TextSkeleton = ({ lines = 3 }) => (
  <div className={styles.textSkeleton}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={i === lines - 1 ? '70%' : '100%'}
        height="14px"
      />
    ))}
  </div>
);

// Image Skeleton
export const ImageSkeleton = ({ aspectRatio = '16/9' }) => (
  <div className={styles.imageSkeleton} style={{ aspectRatio }}>
    <Skeleton variant="rectangular" width="100%" height="100%" />
  </div>
);

// Card Skeleton
export const CardSkeleton = () => (
  <div className={styles.cardSkeleton}>
    <Skeleton height="180px" />
    <div className={styles.cardContent}>
      <Skeleton width="40%" height="12px" />
      <Skeleton width="80%" height="18px" />
      <Skeleton width="60%" height="14px" />
    </div>
  </div>
);

export default Skeleton;
