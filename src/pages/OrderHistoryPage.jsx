import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiFilter, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import OrderService from '../services/orderService';
import OrderCard from '../components/Order/OrderCard';
import Breadcrumb from '../components/Common/Breadcrumb';
import Loading from '../components/Common/Loading';
import styles from './OrderHistoryPage.module.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchOrders = async (page = 1, status = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = { page };
      if (status) params.status = status;

      const response = await OrderService.getOrders(params);

      if (response && response.data) {
        setOrders(response.data.results || response.data);
        setPagination({
          page: response.data.current_page || page,
          totalPages: response.data.total_pages || 1,
          totalCount: response.data.count || response.data.length || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter orders client-side for now
    // Could be enhanced with server-side search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchOrders(newPage, statusFilter);
    }
  };

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'My Orders', path: '/orders' }]} />
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'My Orders', path: '/orders' },
        ]} />

        <div className={styles.header}>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>Track, manage, and view your order history</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusSelect}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </form>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => fetchOrders(1, statusFilter)}>Try Again</button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <FiPackage className={styles.emptyIcon} />
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/products" className={styles.shopBtn}>
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.orders}>
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={styles.pageBtn}
                >
                  <FiChevronLeft />
                </button>

                <span className={styles.pageInfo}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={styles.pageBtn}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
