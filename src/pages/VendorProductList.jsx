import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPackage,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiAlertCircle,
} from 'react-icons/fi';
import VendorService from '../services/vendorService';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import Loading from '../components/Common/Loading';
import styles from './VendorProductList.module.css';

const VendorProductList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [deleteModal, setDeleteModal] = useState({ show: false, productId: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await VendorService.getVendorProducts();
      setProducts(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await VendorService.deleteProduct(deleteModal.productId);
      setProducts(products.filter(p => p.id !== deleteModal.productId));
      setDeleteModal({ show: false, productId: null });
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: styles.outOfStock };
    if (stock < 10) return { label: 'Low Stock', class: styles.lowStock };
    return { label: 'In Stock', class: styles.inStock };
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Vendor Dashboard', path: '/vendor/dashboard' },
            { label: 'My Products', path: '/vendor/products' },
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
          { label: 'My Products', path: '/vendor/products' },
        ]} />

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Products</h1>
            <p className={styles.subtitle}>Manage your product inventory</p>
          </div>
          <Link to="/vendor/products/add" className={styles.addButton}>
            <FiPlus /> Add New Product
          </Link>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FiAlertCircle />
            {error}
            <button onClick={() => setError('')}>&times;</button>
          </div>
        )}

        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <FiPackage className={styles.emptyIcon} />
            <h3>No Products Yet</h3>
            <p>Start adding products to your inventory</p>
            <Link to="/vendor/products/add" className={styles.addButton}>
              <FiPlus /> Add Your First Product
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className={styles.productGrid}>
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock_quantity || product.stock || 0);
              return (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.image || product.images?.[0] ? (
                      <img
                        src={product.image || product.images[0].image}
                        alt={product.name || product.product_name}
                      />
                    ) : (
                      <div className={styles.noImage}>
                        <FiPackage />
                      </div>
                    )}
                    <span className={`${styles.stockBadge} ${stockStatus.class}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{product.name || product.product_name}</h3>
                    <p className={styles.price}>
                      {product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A'}
                    </p>
                    <p className={styles.stock}>
                      Stock: {product.stock_quantity || product.stock || 0}
                    </p>
                  </div>
                  <div className={styles.productActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => navigate(`/vendor/products/edit/${product.id}`)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setDeleteModal({ show: true, productId: product.id })}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.productList}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const stockStatus = getStockStatus(product.stock_quantity || product.stock || 0);
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.productThumb}>
                            {product.image || product.images?.[0] ? (
                              <img
                                src={product.image || product.images[0].image}
                                alt={product.name || product.product_name}
                              />
                            ) : (
                              <FiPackage />
                            )}
                          </div>
                          <span>{product.name || product.product_name}</span>
                        </div>
                      </td>
                      <td>{product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A'}</td>
                      <td>{product.stock_quantity || product.stock || 0}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${stockStatus.class}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td>
                        <div className={styles.tableActions}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => navigate(`/vendor/products/edit/${product.id}`)}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => setDeleteModal({ show: true, productId: product.id })}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Delete Product</h3>
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setDeleteModal({ show: false, productId: null })}
                >
                  Cancel
                </button>
                <button className={styles.confirmDeleteBtn} onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProductList;