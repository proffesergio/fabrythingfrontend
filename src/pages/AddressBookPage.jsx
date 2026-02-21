import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiArrowLeft,
  FiX,
} from 'react-icons/fi';
import AddressService from '../services/addressService';
import Breadcrumb from '../components/Common/Breadcrumb';
import Loading from '../components/Common/Loading';
import styles from './AddressBookPage.module.css';

const AddressBookPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: '',
    is_default: false,
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await AddressService.getAddresses();
      if (response && response.data) {
        setAddresses(response.data.results || response.data);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AddressService.updateAddress(editingId, formData);
      } else {
        await AddressService.addAddress(formData);
      }
      await fetchAddresses();
      resetForm();
    } catch (err) {
      console.error('Error saving address:', err);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name || '',
      street: address.street || address.address || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || address.zip_code || '',
      country: address.country || 'US',
      phone: address.phone || '',
      is_default: address.is_default || false,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      await AddressService.deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await AddressService.setDefaultAddress(id);
      await fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      phone: '',
      is_default: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'My Account', path: '/account' },
          { label: 'Addresses', path: '/addresses' },
        ]} />

        <div className={styles.header}>
          <Link to="/account" className={styles.backLink}>
            <FiArrowLeft /> Back to Account
          </Link>
          <h1 className={styles.title}>Address Book</h1>
          <p className={styles.subtitle}>Manage your delivery addresses</p>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className={styles.content}>
            {/* Address List */}
            <div className={styles.addressGrid}>
              {/* Add New Address Card */}
              {!showForm && (
                <button className={styles.addCard} onClick={() => setShowForm(true)}>
                  <FiPlus className={styles.addIcon} />
                  <span>Add New Address</span>
                </button>
              )}

              {/* Address Cards */}
              {addresses.map((address) => (
                <div key={address.id} className={`${styles.addressCard} ${address.is_default ? styles.default : ''}`}>
                  {address.is_default && (
                    <div className={styles.defaultBadge}>
                      <FiCheck /> Default
                    </div>
                  )}
                  <div className={styles.addressContent}>
                    <h3 className={styles.addressName}>{address.name}</h3>
                    <p className={styles.addressText}>
                      {address.street || address.address}<br />
                      {address.city}, {address.state} {address.postal_code || address.zip_code}<br />
                      {address.country}
                    </p>
                    {address.phone && (
                      <p className={styles.addressPhone}>{address.phone}</p>
                    )}
                  </div>
                  <div className={styles.addressActions}>
                    {!address.is_default && (
                      <button
                        className={styles.defaultBtn}
                        onClick={() => handleSetDefault(address.id)}
                        title="Set as default"
                      >
                        <FiCheck /> Set Default
                      </button>
                    )}
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(address)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(address.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className={styles.formCard}>
                <div className={styles.formHeader}>
                  <h2>{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                  <button className={styles.closeBtn} onClick={resetForm}>
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Address Label</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Home, Office"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="street">Street Address</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="state">State/Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="postal_code">ZIP/Postal Code</label>
                      <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="country">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="BD">Bangladesh</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="For delivery notifications"
                    />
                  </div>

                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={formData.is_default}
                        onChange={handleChange}
                      />
                      <span>Set as default address</span>
                    </label>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" className={styles.cancelBtn} onClick={resetForm}>
                      Cancel
                    </button>
                    <button type="submit" className={styles.submitBtn}>
                      {editingId ? 'Update Address' : 'Add Address'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBookPage;
