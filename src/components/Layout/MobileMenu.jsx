import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiX, FiHome, FiShoppingBag, FiHeart, FiUser, FiPackage, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import styles from './MobileMenu.module.css';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.menuHeader}>
          <Link to="/" className={styles.logo} onClick={onClose}>
            <span className={styles.logoText}>Fabrything</span>
          </Link>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link to="/" className={styles.navItem}>
            <FiHome />
            <span>Home</span>
          </Link>

          <Link to="/products" className={styles.navItem}>
            <FiShoppingBag />
            <span>All Products</span>
          </Link>

          <div className={styles.categorySection}>
            <h4 className={styles.sectionTitle}>Categories</h4>
            <Link to="/products?category=men" className={styles.categoryItem}>
              Men's Clothing
            </Link>
            <Link to="/products?category=women" className={styles.categoryItem}>
              Women's Fashion
            </Link>
            <Link to="/products?category=footwear" className={styles.categoryItem}>
              Footwear
            </Link>
            <Link to="/products?category=skincare" className={styles.categoryItem}>
              Premium Skincare
            </Link>
          </div>

          <div className={styles.categorySection}>
            <h4 className={styles.sectionTitle}>Account</h4>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={styles.navItem}>
                  <FiUser />
                  <span>My Dashboard</span>
                </Link>
                <Link to="/orders" className={styles.navItem}>
                  <FiPackage />
                  <span>My Orders</span>
                </Link>
                <Link to="/wishlist" className={styles.navItem}>
                  <FiHeart />
                  <span>Wishlist</span>
                </Link>
                <Link to="/vendors" className={styles.navItem}>
                  <FiUsers />
                  <span>Vendor Portal</span>
                </Link>
              </>
            ) : (
              <Link to="/login" className={styles.navItem}>
                <FiUser />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
