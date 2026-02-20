import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Rating from './Rating';
import Badge from './Badge';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, variant = 'default' }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const {
    id,
    name,
    price,
    discount_price,
    image,
    image_url,
    rating,
    review_count,
    is_featured,
    is_new,
    on_sale,
    category,
  } = product;

  const imageSrc = image || image_url || 'https://via.placeholder.com/300x400';
  const currentPrice = discount_price || price;
  const hasDiscount = discount_price && discount_price < price;
  const discountPercentage = hasDiscount ? Math.round(((price - discount_price) / price) * 100) : 0;
  const inWishlist = isInWishlist(id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <Link to={`/product/${id}`} className={styles.imageWrapper}>
        <img src={imageSrc} alt={name} className={styles.image} loading="lazy" />

        {/* Badges */}
        <div className={styles.badges}>
          {is_new && <Badge type="new" />}
          {on_sale && <Badge type="sale" discount={discountPercentage} />}
          {is_featured && <Badge type="featured" />}
        </div>

        {/* Quick Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.wishlistBtn} ${inWishlist ? styles.active : ''}`}
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart />
          </button>
          <button className={styles.actionBtn} aria-label="Quick view">
            <FiEye />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.cartBtn}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            <FiShoppingCart />
          </button>
        </div>
      </Link>

      <div className={styles.content}>
        {category && <span className={styles.category}>{category}</span>}
        <Link to={`/product/${id}`} className={styles.name}>
          {name}
        </Link>

        <div className={styles.ratingWrapper}>
          <Rating value={rating || 0} />
          <span className={styles.reviewCount}>({review_count || 0})</span>
        </div>

        <div className={styles.priceWrapper}>
          <span className={styles.currentPrice}>${currentPrice?.toFixed(2)}</span>
          {hasDiscount && (
            <span className={styles.originalPrice}>${price?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
