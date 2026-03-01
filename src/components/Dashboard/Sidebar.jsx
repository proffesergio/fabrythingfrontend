import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Dashboard.module.css';

const Sidebar = ({ open }) => {
  const { items: menuItems, status, error } = useSelector((state) => state.sidebardata);

  // Get icon or use default
  const getIcon = (iconString) => {
    if (iconString && iconString.length <= 2) {
      return iconString;
    }
    return '📋';
  };

  // Render loading state
  if (status === 'loading') {
    return (
      <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
        <nav className={styles.sidebarNav}>
          <ul>
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <div className={styles.skeleton}>
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonText}></div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    );
  }

  // Render error state
  if (status === 'failed') {
    return (
      <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
        <nav className={styles.sidebarNav}>
          <div className={styles.errorContainer}>
            <p>{error || 'Failed to load menu items'}</p>
          </div>
        </nav>
      </aside>
    );
  }

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : styles.closed}`}>
      <nav className={styles.sidebarNav}>
        <ul>
          {menuItems.map((menu) => (
            <li key={menu.id || menu.module_name}>
              <NavLink
                to={menu.module_url || '/dashboard'}
                className={({ isActive }) => isActive ? styles.active : ''}
              >
                <span className={styles.menuIcon}>{getIcon(menu.module_icon)}</span>
                <span className={styles.menuName}>{menu.module_name}</span>
              </NavLink>
              {/* Submenus */}
              {menu.submenus && menu.submenus.length > 0 && (
                <ul className={styles.submenu}>
                  {menu.submenus.map((submenu) => (
                    <li key={submenu.id || submenu.module_name}>
                      <NavLink
                        to={submenu.module_url || '#'}
                        className={({ isActive }) => isActive ? styles.active : ''}
                      >
                        <span className={styles.submenuIcon}>{getIcon(submenu.module_icon)}</span>
                        <span className={styles.submenuName}>{submenu.module_name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;