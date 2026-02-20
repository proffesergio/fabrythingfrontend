import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './Rating.module.css';

const Rating = ({ value = 0, maxStars = 5, showValue = false, size = 'medium', onChange }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  const handleClick = (rating) => {
    if (onChange) {
      onChange(rating);
    }
  };

  for (let i = 1; i <= maxStars; i++) {
    let starClass = styles.star;

    if (i <= fullStars) {
      starClass += ` ${styles.filled}`;
    } else if (i === fullStars + 1 && hasHalfStar) {
      starClass += ` ${styles.half}`;
    }

    stars.push(
      <span
        key={i}
        className={`${starClass} ${styles[size]}`}
        onClick={() => handleClick(i)}
        style={{ cursor: onChange ? 'pointer' : 'default' }}
      >
        <FiStar />
      </span>
    );
  }

  return (
    <div className={styles.rating}>
      <div className={styles.stars}>{stars}</div>
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;
