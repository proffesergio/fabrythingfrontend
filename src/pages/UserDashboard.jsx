import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiHeart,
  FiMapPin,
  FiUser,
  FiClock,
  FiChevronRight,
  FiBox,
  FiShoppingBag,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import OrderService from '../services/orderService';
import VendorService from '../services/vendorService';
import OrderCard from '../components/Order/OrderCard';
import Breadcrumb from '../components/Common/Breadcrumb';
import Loading from '../components/Common/Loading';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const [vendorStats, setVendorStats] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingOrders(true);
        const [ordersResponse, vendorStatus] = await Promise.all([
          OrderService.getOrders({ page: 1 }),
          VendorService.checkVendorStatus().catch(() => ({ isVendor: false, isApproved: false }))
        ]);

        // Check if user is a vendor
        if (vendorStatus.isVendor && vendorStatus.isApproved) {
          setIsVendor(true);
          // Fetch vendor stats if approved
          try {
            const statsData = await VendorService.getVendorStats();
            setVendorStats(statsData);
          } catch (err) {
            console.error('Error fetching vendor stats:', err);
          }
        }

        if (ordersResponse && ordersResponse.data) {
          const orders = ordersResponse.data.results || ordersResponse.data;
          setRecentOrders(orders.slice(0, 3));

          // Calculate stats
          const total = orders.length;
          const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
          const delivered = orders.filter(o => o.status === 'delivered').length;

          setStats({ totalOrders: total, pendingOrders: pending, deliveredOrders: delivered });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchData();
  }, []);

  const quickLinks = [
    {
      icon: FiPackage,
      label: 'My Orders',
      description: 'Track, return, or buy again',
      link: '/orders',
    },
    {
      icon: FiHeart,
      label: 'Wishlist',
      description: 'Your saved items',
      link: '/wishlist',
    },
    {
      icon: FiMapPin,
      label: 'Addresses',
      description: 'Manage delivery addresses',
      link: '/addresses',
    },
    {
      icon: FiUser,
      label: 'Account Settings',
      description: 'Profile, password, preferences',
      link: '/profile',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'My Account', path: '/account' },
        ]} />

        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome back, {user?.first_name || user?.username || 'User'}!
          </h1>
          <p className={styles.subtitle}>Manage your account and view your activity</p>
        </div>

        {/* Vendor Section - Show for vendors */}
        {isVendor && (
          <div className={styles.vendorSection}>
            <div className={styles.vendorCard}>
              <div className={styles.vendorInfo}>
                <FiShoppingBag className={styles.vendorIcon} />
                <div>
                  <h3>Vendor Account Active</h3>
                  <p>You have access to vendor features and can manage your products</p>
                </div>
              </div>
              <div className={styles.vendorActions}>
                <Link to="/vendor/dashboard" className={styles.vendorBtn}>
                  Go to Vendor Dashboard
                </Link>
                <Link to="/vendor/products" className={styles.vendorBtnSecondary}>
                  Manage Products
                </Link>
              </div>
            </div>
            {vendorStats && (
              <div className={styles.vendorStats}>
                <div className={styles.vendorStatItem}>
                  <span className={styles.vendorStatValue}>{vendorStats.total_products || 0}</span>
                  <span className={styles.vendorStatLabel}>Products</span>
                </div>
                <div className={styles.vendorStatItem}>
                  <span className={styles.vendorStatValue}>{vendorStats.pending_orders || 0}</span>
                  <span className={styles.vendorStatLabel}>Pending Orders</span>
                </div>
                <div className={styles.vendorStatItem}>
                  <span className={styles.vendorStatValue}>${vendorStats.total_earnings || 0}</span>
                  <span className={styles.vendorStatLabel}>Earnings</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <FiPackage className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.totalOrders}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiClock className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.pendingOrders}</span>
              <span className={styles.statLabel}>Pending Orders</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiBox className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.deliveredOrders}</span>
              <span className={styles.statLabel}>Delivered</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiHeart className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{wishlistItems.length}</span>
              <span className={styles.statLabel}>Wishlist Items</span>
            </div>
          </div>
        </div>

        {/* Vendor Section */}
        {isVendor && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Vendor Dashboard</h2>
            <div className={styles.quickLinks}>
              <Link to="/vendor/dashboard" className={styles.quickLink}>
                <div className={styles.quickLinkIcon}>
                  <FiShoppingBag />
                </div>
                <div className={styles.quickLinkContent}>
                  <span className={styles.quickLinkLabel}>Go to Vendor Dashboard</span>
                  <span className={styles.quickLinkDesc}>Manage your products and orders</span>
                </div>
                <FiChevronRight className={styles.quickLinkArrow} />
              </Link>
              {vendorStats && (
                <div className={styles.statsGrid}>
                  {vendorStats.total_products !== undefined && (
                    <div className={styles.statCard}>
                      <FiPackage className={styles.statIcon} />
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{vendorStats.total_products}</span>
                        <span className={styles.statLabel}>Total Products</span>
                      </div>
                    </div>
                  )}
                  {vendorStats.pending_orders !== undefined && (
                    <div className={styles.statCard}>
                      <FiClock className={styles.statIcon} />
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{vendorStats.pending_orders}</span>
                        <span className={styles.statLabel}>Pending Orders</span>
                      </div>
                    </div>
                  )}
                  {vendorStats.total_sales !== undefined && (
                    <div className={styles.statCard}>
                      <FiBox className={styles.statIcon} />
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{vendorStats.total_sales}</span>
                        <span className={styles.statLabel}>Total Sales</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.mainContent}>
          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.quickLinks}>
              {quickLinks.map((item, index) => (
                <Link key={index} to={item.link} className={styles.quickLink}>
                  <div className={styles.quickLinkIcon}>
                    <item.icon />
                  </div>
                  <div className={styles.quickLinkContent}>
                    <span className={styles.quickLinkLabel}>{item.label}</span>
                    <span className={styles.quickLinkDesc}>{item.description}</span>
                  </div>
                  <FiChevronRight className={styles.quickLinkArrow} />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Orders</h2>
              <Link to="/orders" className={styles.viewAllLink}>
                View All <FiChevronRight />
              </Link>
            </div>

            {loadingOrders ? (
              <Loading />
            ) : recentOrders.length > 0 ? (
              <div className={styles.ordersList}>
                {recentOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyOrders}>
                <FiPackage className={styles.emptyIcon} />
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className={styles.shopLink}>
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
