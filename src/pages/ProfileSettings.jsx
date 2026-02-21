import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiLock, FiArrowLeft, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const { user, updateProfile, loading } = useAuth();

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileForm.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!profileForm.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!profileForm.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordForm.current_password) newErrors.current_password = 'Current password is required';
    if (!passwordForm.new_password) newErrors.new_password = 'New password is required';
    else if (passwordForm.new_password.length < 8) newErrors.new_password = 'Password must be at least 8 characters';
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    try {
      await updateProfile(profileForm);
      setProfileSuccess('Profile updated successfully!');
      setErrors({});
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      // API call to change password would go here
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setErrors({});
    } catch (err) {
      setErrors({ password: err.message });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'My Account', path: '/account' },
          { label: 'Profile Settings', path: '/profile' },
        ]} />

        <div className={styles.header}>
          <Link to="/account" className={styles.backLink}>
            <FiArrowLeft /> Back to Account
          </Link>
          <h1 className={styles.title}>Profile Settings</h1>
          <p className={styles.subtitle}>Manage your personal information and security</p>
        </div>

        <div className={styles.content}>
          {/* Personal Information */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FiUser className={styles.cardIcon} />
              <h2>Personal Information</h2>
            </div>

            {profileSuccess && (
              <div className={styles.success}>{profileSuccess}</div>
            )}

            <form onSubmit={handleProfileSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    className={errors.first_name ? styles.error : ''}
                  />
                  {errors.first_name && (
                    <span className={styles.errorText}><FiAlertCircle /> {errors.first_name}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    className={errors.last_name ? styles.error : ''}
                  />
                  {errors.last_name && (
                    <span className={styles.errorText}><FiAlertCircle /> {errors.last_name}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && (
                  <span className={styles.errorText}><FiAlertCircle /> {errors.email}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <FiSave /> Save Changes
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FiLock className={styles.cardIcon} />
              <h2>Change Password</h2>
            </div>

            {passwordSuccess && (
              <div className={styles.success}>{passwordSuccess}</div>
            )}

            <form onSubmit={handlePasswordSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="current_password">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  className={errors.current_password ? styles.error : ''}
                />
                {errors.current_password && (
                  <span className={styles.errorText}><FiAlertCircle /> {errors.current_password}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="new_password">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  className={errors.new_password ? styles.error : ''}
                />
                {errors.new_password && (
                  <span className={styles.errorText}><FiAlertCircle /> {errors.new_password}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirm_password">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  className={errors.confirm_password ? styles.error : ''}
                />
                {errors.confirm_password && (
                  <span className={styles.errorText}><FiAlertCircle /> {errors.confirm_password}</span>
                )}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <FiLock /> Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
