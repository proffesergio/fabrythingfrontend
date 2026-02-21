import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft, FiSave, FiImage, FiTrash2, FiPlus, FiAlertCircle
} from 'react-icons/fi';
import VendorService from '../services/vendorService';
import ProductService from '../services/productService';
import Breadcrumb from '../components/Common/Breadcrumb';
import Loading from '../components/Common/Loading';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_price: '',
    category: '',
    subcategory: '',
    brand: '',
    sku: '',
    stock_quantity: '',
    is_active: true,
    is_featured: false,
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await ProductService.getCategories();
      setCategories(response.data?.results || response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await VendorService.getVendorProducts();
      const products = response.data?.results || response.data || [];
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          compare_price: product.compare_price || '',
          category: product.category?.id || product.category || '',
          subcategory: product.subcategory || '',
          brand: product.brand || '',
          sku: product.sku || '',
          stock_quantity: product.stock_quantity || '',
          is_active: product.is_active ?? true,
          is_featured: product.is_featured ?? false,
          images: product.images || [],
        });
        if (product.images && product.images.length > 0) {
          setImagePreviews(product.images.map(img => ({
            url: img.image || img.url,
            id: img.id
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
      const previews = files.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (imagePreviews[index]?.file) {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          if (key === 'is_active' || key === 'is_featured') {
            submitData.append(key, formData[key] ? 'true' : 'false');
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      newImages.forEach(image => {
        submitData.append('images', image);
      });

      if (isEdit) {
        await VendorService.updateProduct(id, submitData);
      } else {
        await VendorService.addProduct(submitData);
      }

      navigate('/vendor/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Vendor Dashboard', path: '/vendor/dashboard' },
            { label: 'My Products', path: '/vendor/products' },
            { label: isEdit ? 'Edit Product' : 'Add Product', path: '/vendor/products/add' },
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
          { label: isEdit ? 'Edit Product' : 'Add Product', path: '/vendor/products/add' },
        ]} />

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link to="/vendor/products" className={styles.backBtn}>
              <FiArrowLeft /> Back
            </Link>
            <div>
              <h1 className={styles.title}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className={styles.subtitle}>
                {isEdit ? 'Update your product details' : 'Fill in your product details'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <FiAlertCircle />
            {error}
            <button onClick={() => setError('')}>&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Main Info */}
            <div className={styles.formSection}>
              <h3>Product Information</h3>

              <div className={styles.formGroup}>
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className={styles.formSection}>
              <h3>Pricing & Inventory</h3>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">Price *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="compare_price">Compare Price</label>
                  <input
                    type="number"
                    id="compare_price"
                    name="compare_price"
                    value={formData.compare_price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="stock_quantity">Stock Quantity *</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="sku">SKU</label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="SKU-001"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className={styles.formSection}>
              <h3>Product Images</h3>

              <div className={styles.imageUpload}>
                <input
                  type="file"
                  id="images"
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className={styles.imageInput}
                />
                <label htmlFor="images" className={styles.imageLabel}>
                  <FiImage />
                  <span>Click to upload images</span>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className={styles.imagePreviews}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img src={preview.url} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() => removeImage(index)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className={styles.formSection}>
              <h3>Status</h3>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  <span>Active</span>
                </label>
                <p className={styles.checkboxHelp}>Enable to show this product in the store</p>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <span>Featured</span>
                </label>
                <p className={styles.checkboxHelp}>Show this product in featured sections</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className={styles.formActions}>
            <Link to="/vendor/products" className={styles.cancelBtn}>
              Cancel
            </Link>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? (
                <>Saving...</>
              ) : (
                <><FiSave /> {isEdit ? 'Update Product' : 'Add Product'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
