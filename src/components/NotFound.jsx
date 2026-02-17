import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>The page you're looking for doesn't exist or has been moved</p>
        <Link to="/dashboard" className={styles.button}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;