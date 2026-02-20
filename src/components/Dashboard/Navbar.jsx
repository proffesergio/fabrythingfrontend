import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';  // Changed from { useAuth }
import styles from './Dashboard.module.css';

const Navbar = ({ onLogout, sidebarOpen, onSidebarToggle }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogoutClick = () => {
    setShowMenu(false);
    onLogout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Toggle Sidebar Button */}
        <button
          className={styles.sidebarToggle}
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        {/* Logo */}
        <div className={styles.logo}>
          <h1>Fabrything</h1>
        </div>

        {/* User Menu */}
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.first_name} {user?.last_name}
            </span>
            <span className={styles.userEmail}>
              {user?.email}
            </span>
          </div>

          <button
            className={styles.userMenuToggle}
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User menu"
          >
            👤
          </button>

          {showMenu && (
            <div className={styles.dropdownMenu}>
              <a href="#profile" className={styles.menuItem}>
                Profile
              </a>
              <a href="#settings" className={styles.menuItem}>
                Settings
              </a>
              <hr />
              <button
                onClick={handleLogoutClick}
                className={styles.logoutBtn}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;