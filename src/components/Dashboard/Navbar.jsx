import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import styles from './Dashboard.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <h1>Fabrything</h1>
        </div>

        <div className={styles.navRight}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user?.first_name || 'User'}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>

          <button className={styles.logoutButton} onClick={handleLogout} title="Logout">
            <FiLogOut />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;