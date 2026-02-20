import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Sidebar = ({ open }) => {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
      <nav className={styles.sidebarNav}>
        <ul>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/products" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              📦 Products
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/orders" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              🛒 Orders
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/customers" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              👥 Customers
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              ⚙️ Settings
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;