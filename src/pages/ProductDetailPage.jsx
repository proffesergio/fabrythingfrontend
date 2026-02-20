import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiShare2, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import Rating from '../components/Common/Rating';
import Badge from '../components/Common/Badge';
import ProductCard from '../components/Common/ProductCard';
import styles from './ProductDetailPage.module.css';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Mock product data
  useEffect(() => {
    const mockProduct = {
      id: parseInt(id) || 1,
      name: 'Premium Cotton Oxford Shirt',
      description: 'This premium cotton oxford shirt features a classic fit with a modern twist. Made from 100% organic cotton, it offers superior comfort and durability. Perfect for both formal and casual occasions.',
      long_description: 'Our Premium Cotton Oxford Shirt is crafted with attention to every detail. The fabric is specially treated for extra softness and wrinkle resistance. Features a button-down collar, single chest pocket, and adjustable cuffs.',
      price: 49.99,
      discount_price: 39.99,
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
        'https://images.unsplash.com/photo-1595944024804-5a687fbb4913?w=800&q=80',
      ],
      rating: 4.5,
      review_count: 128,
      category: "Men's Clothing",
      brand: 'Fabrything Original',
      sku: 'FT-SHIRT-001',
      tags: ['cotton', 'formal', 'casual', 'premium'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#1E3A8A' },
        { name: 'Pink', hex: '#EC4899' },
      ],
      stock: 50,
      is_featured: true,
      is_new: true,
    };

    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>Product not found</div>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Related products mock
  const relatedProducts = [
    {
      id: 2,
      name: 'Elegant Silk Blouse',
      price: 89.99,
      discount_price: 69.99,
      image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
      rating: 4.8,
      review_count: 95,
      category: "Women's",
    },
    {
      id: 5,
      name: 'Slim Fit Chinos',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80',
      rating: 4.4,
      review_count: 89,
      category: "Men's",
    },
    {
      id: 6,
      name: 'Designer Summer Dress',
      price: 99.99,
      discount_price: 79.99,
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80',
      rating: 4.7,
      review_count: 156,
      category: "Women's",
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: 'Products', path: '/products' },
            { label: product.category, path: `/products?category=${product.category?.toLowerCase()}` },
            { label: product.name, path: `/product/${product.id}` },
          ]}
        />

        <div className={styles.product}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <img src={product.images[selectedImage]} alt={product.name} />
              {hasDiscount && <Badge type="sale" discount={discountPercentage} />}
              {product.is_new && <Badge type="new" />}
            </div>
            <div className={styles.thumbnails}>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            <div className={styles.brand}>{product.brand}</div>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <Rating value={product.rating} />
              <span className={styles.reviewCount}>({product.review_count} reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>
                ${(product.discount_price || product.price).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className={styles.originalPrice}>${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Size Selection */}
            {product.sizes && (
              <div className={styles.option}>
                <label>Size:</label>
                <div className={styles.sizeOptions}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.active : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && (
              <div className={styles.option}>
                <label>Color:</label>
                <div className={styles.colorOptions}>
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`${styles.colorBtn} ${selectedColor === color.name ? styles.active : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.option}>
              <label>Quantity:</label>
              <div className={styles.quantity}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>

            {/* Stock Status */}
            <div className={styles.stock}>
              <FiCheck /> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.addToCart} onClick={handleAddToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
              <button
                className={`${styles.wishlistBtn} ${inWishlist ? styles.active : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <FiHeart />
              </button>
              <button className={styles.shareBtn}>
                <FiShare2 />
              </button>
            </div>

            {/* SKU */}
            <div className={styles.meta}>
              <span>SKU: {product.sku}</span>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className={styles.tabs}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'description' ? styles.active : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'vendor' ? styles.active : ''}`}
              onClick={() => setActiveTab('vendor')}
            >
              Vendor Info
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'shipping' ? styles.active : ''}`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping Info
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.descriptionTab}>
                <p>{product.long_description || product.description}</p>
              </div>
            )}
            {activeTab === 'vendor' && (
              <div className={styles.vendorTab}>
                <div className={styles.vendorCard}>
                  <div className={styles.vendorInfo}>
                    <div className={styles.vendorBadge}>Verified Vendor</div>
                    <h4>{product.brand || 'Fabrything Store'}</h4>
                    <p>Quality verified seller with excellent customer service</p>
                    <div className={styles.vendorStats}>
                      <div className={styles.vendorStat}>
                        <span className={styles.statValue}>98%</span>
                        <span className={styles.statLabel}>Positive Feedback</span>
                      </div>
                      <div className={styles.vendorStat}>
                        <span className={styles.statValue}>500+</span>
                        <span className={styles.statLabel}>Orders</span>
                      </div>
                      <div className={styles.vendorStat}>
                        <span className={styles.statValue}>1 Year</span>
                        <span className={styles.statLabel}>On Fabrything</span>
                      </div>
                    </div>
                    <Link to="/become-vendor" className={styles.vendorLink}>
                      Open Your Own Store
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className={styles.shippingTab}>
                <div className={styles.shippingInfo}>
                  <h4>Shipping Options</h4>
                  <ul>
                    <li>Standard Delivery: 3-5 Business Days - Free on orders above $50</li>
                    <li>Express Delivery: 1-2 Business Days - $9.99</li>
                    <li>Same Day Delivery (Dhaka Only): $4.99</li>
                  </ul>
                  <h4>Return Policy</h4>
                  <ul>
                    <li>30-day hassle-free returns</li>
                    <li>Free return shipping on defective items</li>
                    <li>Easy exchange process</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>You May Also Like</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
