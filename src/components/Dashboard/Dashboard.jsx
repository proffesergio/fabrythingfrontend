import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { fetchSidebar } from '../../redux/reducer/sidebardata';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.sidebardata);

  // Fetch sidebar menus when component mounts
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSidebar());
    }
  }, [status, dispatch]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <Navbar 
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={styles.dashboardContent}>
        <Sidebar open={sidebarOpen} />
        
        <main className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Welcome back, {user?.first_name}!</h1>
            <p>Here's what's happening with your store today.</p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Total Orders</h3>
              <p className={styles.stat}>0</p>
            </div>
            <div className={styles.card}>
              <h3>Revenue</h3>
              <p className={styles.stat}>$0.00</p>
            </div>
            <div className={styles.card}>
              <h3>Products</h3>
              <p className={styles.stat}>0</p>
            </div>
            <div className={styles.card}>
              <h3>Customers</h3>
              <p className={styles.stat}>0</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;