import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, getProfile } = useAuth();

  useEffect(() => {
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.welcomeSection}>
            <h1>Welcome, {user?.first_name || 'User'}! 👋</h1>
            <p>You're logged in and ready to manage your inventory</p>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Total Orders</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.largeNumber}>0</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Products</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.largeNumber}>0</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Revenue</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.largeNumber}>$0</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Customers</h3>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.largeNumber}>0</p>
              </div>
            </div>
          </div>

          <div className={styles.profileSection}>
            <h2>Your Profile</h2>
            <div className={styles.profileCard}>
              <p>
                <strong>Name:</strong> {user?.first_name} {user?.last_name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Account Status:</strong> {user?.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;