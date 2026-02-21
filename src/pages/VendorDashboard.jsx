import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiTrendingUp, FiShoppingBag, FiDollarSign, FiPackage,
  FiArrowUpRight, FiArrowDownRight, FiPlus, FiGrid,
  FiClock, FiCheckCircle, FiXCircle, FiRefreshCw
} from 'react-icons/fi';
import VendorService from '../services/vendorService';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './VendorDashboard.module.css';

const VendorDashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [isAuthenticated, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await VendorService.getVendorStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for chart
  const salesData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 19000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 22000 },
    { month: 'May', sales: 28000 },
    { month: 'Jun', sales: 35000 },
  ];

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Vendor Dashboard', path: '/vendor/dashboard' }]} />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Vendor Dashboard', path: '/vendor/dashboard' }]} />
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={fetchStats} className={styles.retryBtn}>
              <FiRefreshCw /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not a vendor yet
  if (stats && !stats.is_approved) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Vendor Dashboard', path: '/vendor/dashboard' }]} />
          <div className={styles.pendingContainer}>
            <div className={styles.pendingIcon}>
              <FiClock />
            </div>
            <h2>Application Under Review</h2>
            <p>Your vendor application is being reviewed. Once approved, you'll have access to the vendor dashboard.</p>
            <Link to="/vendor/status" className={styles.checkStatusBtn}>
              Check Application Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Vendor Dashboard', path: '/vendor/dashboard' }]} />

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Vendor Dashboard</h1>
            <p>Welcome back, {stats?.business_name || 'Vendor'}!</p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/vendor/products/add" className={styles.addProductBtn}>
              <FiPlus /> Add Product
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#3b82f6' }}>
              <FiTrendingUp />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Sales</span>
              <span className={styles.statValue}>৳{stats?.total_sales?.toLocaleString() || '0'}</span>
              <span className={styles.statChange}>
                <FiArrowUpRight /> +12% from last month
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#d1fae5', color: '#10b981' }}>
              <FiShoppingBag />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Orders</span>
              <span className={styles.statValue}>{stats?.total_orders || '0'}</span>
              <span className={styles.statChange}>
                <FiArrowUpRight /> +8% from last month
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#f59e0b' }}>
              <FiPackage />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Products</span>
              <span className={styles.statValue}>{stats?.total_products || '0'}</span>
              <span className={styles.statChange}>
                <FiArrowUpRight /> +3 new this week
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fce7f3', color: '#ec4899' }}>
              <FiDollarSign />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Pending Payout</span>
              <span className={styles.statValue}>৳{stats?.pending_payout?.toLocaleString() || '0'}</span>
              <span className={styles.statChange}>
                <FiClock /> Next payout: Weekly
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Sales Chart */}
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>Sales Overview</h3>
              <select className={styles.periodSelect}>
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className={styles.chart}>
              <div className={styles.chartBars}>
                {salesData.map((item, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div
                      className={styles.bar}
                      style={{ height: `${(item.sales / maxSales) * 100}%` }}
                    >
                      <span className={styles.barTooltip}>৳{item.sales.toLocaleString()}</span>
                    </div>
                    <span className={styles.barLabel}>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className={styles.ordersCard}>
            <div className={styles.cardHeader}>
              <h3>Recent Orders</h3>
              <Link to="/vendor/orders" className={styles.viewAllLink}>View All</Link>
            </div>
            <div className={styles.ordersList}>
              {stats?.recent_orders?.length > 0 ? (
                stats.recent_orders.map((order, index) => (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderId}>#{order.id}</span>
                      <span className={styles.orderDate}>{order.date}</span>
                    </div>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderAmount}>৳{order.amount}</span>
                      <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyOrders}>
                  <FiShoppingBag className={styles.emptyIcon} />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <Link to="/vendor/products/add" className={styles.actionCard}>
              <FiPlus className={styles.actionIcon} />
              <span>Add Product</span>
            </Link>
            <Link to="/vendor/inventory" className={styles.actionCard}>
              <FiGrid className={styles.actionIcon} />
              <span>Manage Inventory</span>
            </Link>
            <Link to="/vendor/orders" className={styles.actionCard}>
              <FiShoppingBag className={styles.actionIcon} />
              <span>View Orders</span>
            </Link>
            <Link to="/vendor/payouts" className={styles.actionCard}>
              <FiDollarSign className={styles.actionIcon} />
              <span>Request Payout</span>
            </Link>
          </div>
        </div>

        {/* Commission Info */}
        <div className={styles.commissionCard}>
          <div className={styles.commissionContent}>
            <h4>Your Commission Rate</h4>
            <p>You're currently earning with a <strong>{stats?.commission_rate || 10}% commission</strong> on each sale.</p>
          </div>
          <div className={styles.commissionInfo}>
            <span className={styles.commissionValue}>{stats?.commission_rate || 10}%</span>
            <span className={styles.commissionLabel}>Commission</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
