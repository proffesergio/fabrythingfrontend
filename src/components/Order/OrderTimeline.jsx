import React from 'react';
import { FiCheck, FiCircle, FiTruck, FiPackage, FiHome, FiClock } from 'react-icons/fi';
import styles from './OrderTimeline.module.css';

const OrderTimeline = ({ currentStatus = 'pending', statusHistory = [] }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: FiClock },
    { key: 'processing', label: 'Processing', icon: FiPackage },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiHome },
  ];

  const getStepStatus = (stepKey) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    const currentIndex = steps.findIndex(s => s.key === currentStatus?.toLowerCase());

    if (currentIndex === -1) return 'pending';

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getCompletedSteps = () => {
    const currentIndex = steps.findIndex(s => s.key === currentStatus?.toLowerCase());
    return currentIndex >= 0 ? currentIndex + 1 : 0;
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((getCompletedSteps() - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className={styles.steps}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const Icon = step.icon;

          return (
            <div key={step.key} className={`${styles.step} ${styles[status]}`}>
              <div className={styles.iconWrapper}>
                {status === 'completed' ? (
                  <FiCheck className={styles.icon} />
                ) : (
                  <Icon className={styles.icon} />
                )}
              </div>
              <span className={styles.label}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {statusHistory.length > 0 && (
        <div className={styles.history}>
          <h4>Order Timeline</h4>
          <ul className={styles.historyList}>
            {statusHistory.map((event, index) => (
              <li key={index} className={styles.historyItem}>
                <span className={styles.historyDate}>
                  {new Date(event.date).toLocaleString()}
                </span>
                <span className={styles.historyStatus}>{event.status}</span>
                {event.note && (
                  <span className={styles.historyNote}>{event.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
