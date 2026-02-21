import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import OrderService from '../services/orderService';
import OrderTimeline from '../components/Order/OrderTimeline';
import Breadcrumb from '../components/Common/Breadcrumb';
import Badge from '../components/Common/Badge';
import Loading from '../components/Common/Loading';
import styles from './OrderDetailPage.module.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await OrderService.getOrder(id);

        if (response && response.data) {
          setOrder(response.data);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (orderStatus) => {
    const statusColors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
      returned: 'secondary',
    };
    return statusColors[orderStatus?.toLowerCase()] || 'default';
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'My Orders', path: '/orders' },
            { label: 'Order Details', path: `/order/${id}` },
          ]} />
          <Loading />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'My Orders', path: '/orders' },
            { label: 'Order Details', path: `/order/${id}` },
          ]} />
          <div className={styles.error}>
            <FiPackage className={styles.errorIcon} />
            <h2>{error || 'Order not found'}</h2>
            <Link to="/orders" className={styles.backBtn}>
              <FiArrowLeft /> Back to Orders
            </Link>
          </div>
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
          { label: `Order #${order.order_number || order.id}`, path: `/order/${id}` },
        ]} />

        <div className={styles.header}>
          <Link to="/orders" className={styles.backLink}>
            <FiArrowLeft /> Back to Orders
          </Link>
          <div className={styles.orderTitle}>
            <h1>Order #{order.order_number || order.id}</h1>
            <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
          </div>
          <p className={styles.orderDate}>
            <FiClock /> Placed on {formatDate(order.created_at)}
          </p>
        </div>

        {/* Order Timeline */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Order Status</h2>
          <OrderTimeline
            currentStatus={order.status}
            statusHistory={order.status_history || []}
          />
        </div>

        {/* Order Items */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Order Items</h2>
          <div className={styles.itemsList}>
            {(order.items || []).map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemImage}>
                  <img
                    src={item.product?.image || item.image_url || 'https://via.placeholder.com/80'}
                    alt={item.product?.name || item.name || 'Product'}
                  />
                </div>
                <div className={styles.itemDetails}>
                  <Link
                    to={`/product/${item.product_id || item.product?.id}`}
                    className={styles.itemName}
                  >
                    {item.product?.name || item.name || 'Product'}
                  </Link>
                  {item.variant && (
                    <p className={styles.itemVariant}>
                      {item.variant.size && `Size: ${item.variant.size}`}
                      {item.variant.color && ` / Color: ${item.variant.color}`}
                    </p>
                  )}
                  <p className={styles.itemQty}>Qty: {item.quantity}</p>
                </div>
                <div className={styles.itemPrice}>
                  ${((item.price || item.unit_price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${(order.subtotal || order.total || 0).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>${(order.shipping_cost || 0).toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>${(order.tax || 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discount}`}>
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiMapPin /> Shipping Address
            </h2>
            <div className={styles.addressCard}>
              <p className={styles.addressName}>{order.shipping_address.name}</p>
              <p className={styles.addressText}>
                {order.shipping_address.street}<br />
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                {order.shipping_address.country}
              </p>
              {order.shipping_address.phone && (
                <p className={styles.addressPhone}>{order.shipping_address.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Payment Info */}
        {order.payment && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiCreditCard /> Payment Information
            </h2>
            <div className={styles.paymentInfo}>
              <div className={styles.paymentRow}>
                <span>Method</span>
                <span>{order.payment.method}</span>
              </div>
              <div className={styles.paymentRow}>
                <span>Status</span>
                <Badge variant={order.payment.status === 'paid' ? 'success' : 'warning'}>
                  {order.payment.status}
                </Badge>
              </div>
              {order.tracking_number && (
                <div className={styles.tracking}>
                  <FiTruck />
                  <span>Tracking: {order.tracking_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Actions */}
        <div className={styles.actions}>
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button className={styles.cancelBtn}>
              Cancel Order
            </button>
          )}
          <button className={styles.reorderBtn}>
            <FiCheckCircle /> Reorder
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
