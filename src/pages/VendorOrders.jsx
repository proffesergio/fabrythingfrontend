import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiPackage, FiClock, FiCheckCircle,
  FiXCircle, FiTruck, FiChevronRight, FiAlertCircle
} from 'react-icons/fi';
import VendorService from '../services/vendorService';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import Loading from '../components/Common/Loading';
import styles from './VendorOrders.module.css';

const VendorOrders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateModal, setUpdateModal] = useState({ show: false, orderId: null, newStatus: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await VendorService.getVendorOrders();
      setOrders(response.data?.results || response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await VendorService.updateOrderStatus(updateModal.orderId, updateModal.newStatus);
      setOrders(orders.map(order =>
        order.id === updateModal.orderId
          ? { ...order, status: updateModal.newStatus }
          : order
      ));
      setUpdateModal({ show: false, orderId: null, newStatus: '' });
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order status.');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: FiClock,
        label: 'Pending',
        class: styles.pending
      },
      processing: {
        icon: FiPackage,
        label: 'Processing',
        class: styles.processing
      },
      shipped: {
        icon: FiTruck,
        label: 'Shipped',
        class: styles.shipped
      },
      delivered: {
        icon: FiCheckCircle,
        label: 'Delivered',
        class: styles.delivered
      },
      cancelled: {
        icon: FiXCircle,
        label: 'Cancelled',
        class: styles.cancelled
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toString().includes(searchTerm) ||
      order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Vendor Dashboard', path: '/vendor/dashboard' },
            { label: 'Orders', path: '/vendor/orders' },
          ]} />
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
          { label: 'Vendor Dashboard', path: '/vendor/dashboard' },
          { label: 'Orders', path: '/vendor/orders' },
        ]} />

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Orders</h1>
            <p className={styles.subtitle}>Manage and track your customer orders</p>
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FiAlertCircle />
            {error}
            <button onClick={() => setError('')}>&times;</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <FiPackage className={styles.statIcon} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{orderStats.total}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiClock className={styles.statIcon} style={{ color: '#f59e0b' }} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{orderStats.pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiPackage className={styles.statIcon} style={{ color: '#3b82f6' }} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{orderStats.processing}</span>
              <span className={styles.statLabel}>Processing</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiTruck className={styles.statIcon} style={{ color: '#8b5cf6' }} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{orderStats.shipped}</span>
              <span className={styles.statLabel}>Shipped</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <FiCheckCircle className={styles.statIcon} style={{ color: '#10b981' }} />
            <div className={styles.statContent}>
              <span className={styles.statValue}>{orderStats.delivered}</span>
              <span className={styles.statLabel}>Delivered</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterBox}>
            <FiFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <FiPackage className={styles.emptyIcon} />
            <h3>No Orders Found</h3>
            <p>You don't have any orders yet</p>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <span className={styles.orderId}>#{order.id}</span>
                      {order.order_id && (
                        <span className={styles.orderNumber}>{order.order_id}</span>
                      )}
                    </div>
                    <span className={`${styles.statusBadge} ${statusConfig.class}`}>
                      <StatusIcon /> {statusConfig.label}
                    </span>
                  </div>

                  <div className={styles.orderBody}>
                    <div className={styles.orderDetails}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Customer</span>
                        <span className={styles.detailValue}>
                          {order.customer?.name || order.customer_name || 'N/A'}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Items</span>
                        <span className={styles.detailValue}>
                          {order.items?.length || order.total_items || 0} items
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Total</span>
                        <span className={styles.orderTotal}>
                          ৳{parseFloat(order.total || order.total_amount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Date</span>
                        <span className={styles.detailValue}>
                          {new Date(order.created_at || order.date).toLocaleDateString('en-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    {order.items && order.items.length > 0 && (
                      <div className={styles.orderItems}>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className={styles.orderItem}>
                            <div className={styles.itemImage}>
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <FiPackage />
                              )}
                            </div>
                            <div className={styles.itemInfo}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemQty}>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className={styles.moreItems}>
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.orderFooter}>
                    <Link to={`/order/${order.id}`} className={styles.viewBtn}>
                      View Details <FiChevronRight />
                    </Link>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => setUpdateModal({
                          show: true,
                          orderId: order.id,
                          newStatus: e.target.value
                        })}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Update Status Modal */}
        {updateModal.show && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Update Order Status</h3>
              <p>Are you sure you want to change the order status?</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setUpdateModal({ show: false, orderId: null, newStatus: '' })}
                >
                  Cancel
                </button>
                <button className={styles.confirmBtn} onClick={handleStatusUpdate}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
