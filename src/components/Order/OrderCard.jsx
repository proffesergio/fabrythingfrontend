import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import Badge from '../Common/Badge';
import styles from './OrderCard.module.css';

const OrderCard = ({ order }) => {
  const {
    id,
    order_number,
    created_at,
    status,
    total,
    items = [],
    items_count = 0,
  } = order;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.orderInfo}>
          <span className={styles.orderNumber}>#{order_number || id}</span>
          <span className={styles.orderDate}>{formatDate(created_at)}</span>
        </div>
        <Badge variant={getStatusColor(status)}>{status}</Badge>
      </div>

      <div className={styles.content}>
        <div className={styles.items}>
          {items.slice(0, 3).map((item, index) => (
            <div key={index} className={styles.itemThumb}>
              <img
                src={item.product?.image || item.image_url || 'https://via.placeholder.com/60'}
                alt={item.product?.name || item.name || 'Product'}
              />
            </div>
          ))}
          {items.length > 3 && (
            <div className={styles.moreItems}>+{items.length - 3}</div>
          )}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Items</span>
            <span className={styles.value}>{items_count || items.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Total</span>
            <span className={styles.total}>${parseFloat(total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Link to={`/order/${id}`} className={styles.viewBtn}>
          <FiPackage />
          View Details
          <FiChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
