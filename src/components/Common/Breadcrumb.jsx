import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import styles from './Breadcrumb.module.css';

const Breadcrumb = ({ items = [], home = true }) => {
  const breadcrumbItems = home
    ? [{ label: 'Home', path: '/' }, ...items]
    : items;

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span className={styles.current}>{item.label}</span>
              ) : (
                <>
                  {index === 0 && home ? (
                    <Link to={item.path} className={styles.link}>
                      <FiHome className={styles.homeIcon} />
                    </Link>
                  ) : (
                    <Link to={item.path} className={styles.link}>
                      {item.label}
                    </Link>
                  )}
                  <FiChevronRight className={styles.separator} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
