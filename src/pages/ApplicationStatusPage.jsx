import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import VendorService from '../services/vendorService';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './ApplicationStatusPage.module.css';

const ApplicationStatusPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchStatus();
  }, [isAuthenticated, navigate]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await VendorService.getApplicationStatus();
      setStatus(data);
    } catch (err) {
      if (err.status === 404) {
        // No application found - check if user is already an approved vendor
        try {
          const vendorProfile = await VendorService.getVendorProfile();
          if (vendorProfile && vendorProfile.is_approved) {
            // User is already an approved vendor - show approved status
            setStatus({
              status: 'approved',
              business_name: vendorProfile.business_name,
              id: vendorProfile.id,
              created_at: vendorProfile.created_at,
              updated_at: vendorProfile.updated_at,
            });
          } else {
            setStatus(null);
          }
        } catch (profileErr) {
          // No vendor profile either
          setStatus(null);
        }
      } else {
        setError(err.message || 'Failed to fetch application status');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (statusValue) => {
    const configs = {
      pending: {
        icon: FiClock,
        label: 'Pending Review',
        color: '#f59e0b',
        bgColor: '#fef3c7',
        description: 'Your application is being reviewed by our team.'
      },
      review: {
        icon: FiAlertCircle,
        label: 'Under Review',
        color: '#3b82f6',
        bgColor: '#dbeafe',
        description: 'Your documents are being verified. This usually takes 1-2 business days.'
      },
      approved: {
        icon: FiCheckCircle,
        label: 'Approved',
        color: '#10b981',
        bgColor: '#d1fae5',
        description: 'Congratulations! Your vendor account has been approved.'
      },
      rejected: {
        icon: FiXCircle,
        label: 'Rejected',
        color: '#ef4444',
        bgColor: '#fee2e2',
        description: 'Your application was not approved. Please check the notes below.'
      }
    };
    return configs[statusValue] || configs.pending;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Application Status', path: '/vendor/status' }]} />
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your application status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Application Status', path: '/vendor/status' }]} />
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button onClick={fetchStatus} className={styles.retryBtn}>
              <FiRefreshCw /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Application Status', path: '/vendor/status' }]} />
          <div className={styles.noApplicationContainer}>
            <div className={styles.noApplicationIcon}>
              <FiClock />
            </div>
            <h2>No Application Found</h2>
            <p>You haven't submitted a vendor application yet.</p>
            <Link to="/become-vendor" className={styles.applyBtn}>
              Apply Now <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(status.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Application Status', path: '/vendor/status' }]} />

        <div className={styles.statusContainer}>
          <h1>Vendor Application Status</h1>

          {/* Status Card */}
          <div className={styles.statusCard} style={{ borderLeftColor: statusConfig.color }}>
            <div className={styles.statusHeader} style={{ backgroundColor: statusConfig.bgColor }}>
              <StatusIcon className={styles.statusIcon} style={{ color: statusConfig.color }} />
              <div>
                <h2>{statusConfig.label}</h2>
                <p>{statusConfig.description}</p>
              </div>
            </div>

            <div className={styles.statusDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Business Name</span>
                <span className={styles.detailValue}>{status.business_name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Application ID</span>
                <span className={styles.detailValue}>#{status.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Submitted On</span>
                <span className={styles.detailValue}>
                  {new Date(status.created_at).toLocaleDateString('en-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Updated</span>
                <span className={styles.detailValue}>
                  {new Date(status.updated_at).toLocaleDateString('en-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className={styles.progressTracker}>
            <h3>Application Progress</h3>
            <div className={styles.progressSteps}>
              {['pending', 'review', 'approved', 'rejected'].map((step, index) => {
                const stepIndex = ['pending', 'review', 'approved', 'rejected'].indexOf(status.status);
                const isCompleted = index < stepIndex;
                const isCurrent = index === stepIndex;
                const isRejected = status.status === 'rejected';
                const stepLabels = {
                  pending: 'Submitted',
                  review: 'Under Review',
                  approved: 'Approved',
                  rejected: 'Rejected'
                };

                // For rejected status, only show up to review
                if (isRejected && index > 2) return null;

                return (
                  <div
                    key={step}
                    className={`${styles.progressStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                  >
                    <div className={styles.stepIndicator}>
                      {isCompleted ? <FiCheckCircle /> : <span>{index + 1}</span>}
                    </div>
                    <span className={styles.stepLabel}>{stepLabels[step]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Notes (if any) */}
          {status.admin_notes && (
            <div className={styles.notesCard}>
              <h3>Admin Notes</h3>
              <p>{status.admin_notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            {status.status === 'approved' && (
              <Link to="/vendor/dashboard" className={styles.primaryBtn}>
                Go to Vendor Dashboard <FiArrowRight />
              </Link>
            )}
            {status.status === 'rejected' && (
              <Link to="/become-vendor" className={styles.primaryBtn}>
                Submit New Application <FiArrowRight />
              </Link>
            )}
            {status.status === 'pending' && (
              <button onClick={fetchStatus} className={styles.secondaryBtn}>
                <FiRefreshCw /> Refresh Status
              </button>
            )}
            {status.status === 'review' && (
              <button onClick={fetchStatus} className={styles.secondaryBtn}>
                <FiRefreshCw /> Refresh Status
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusPage;
