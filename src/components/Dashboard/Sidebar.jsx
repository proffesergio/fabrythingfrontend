import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBarChart2,
  FiShoppingCart,
  FiBox,
  FiSettings,
} from 'react-icons/fi';
import styles from './Dashboard.module.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/dashboard' },
    { icon: FiBarChart2, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: FiShoppingCart, label: 'Orders', path: '/dashboard/orders' },
    { icon: FiBox, label: 'Products', path: '/dashboard/products' },
    { icon: FiSettings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.sidebarLink} ${isActive ? styles.active : ''}`}
              title={item.label}
            >
              <Icon className={styles.sidebarIcon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;