import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './WishlistPage.module.css';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item.product, 1);
    removeFromWishlist(item.product_id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Wishlist', path: '/wishlist' }]} />

          <div className={styles.empty}>
            <FiHeart className={styles.emptyIcon} />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love by clicking the heart icon on any product.</p>
            <Link to="/products" className={styles.shopBtn}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Wishlist', path: '/wishlist' }]} />

        <h1 className={styles.title}>My Wishlist ({wishlistItems.length} items)</h1>

        <div className={styles.grid}>
          {wishlistItems.map((item) => {
            const product = item.product || {};
            const image = product.image || product.image_url || 'https://via.placeholder.com/300';
            const name = product.name || 'Product';
            const price = product.discount_price || product.price || 0;

            return (
              <div key={item.product_id} className={styles.item}>
                <Link to={`/product/${item.product_id}`} className={styles.itemImage}>
                  <img src={image} alt={name} />
                </Link>

                <div className={styles.itemDetails}>
                  <Link to={`/product/${product.id}`} className={styles.itemName}>
                    {name}
                  </Link>
                  <p className={styles.itemPrice}>${price.toFixed(2)}</p>

                  <div className={styles.actions}>
                    <button
                      className={styles.moveBtn}
                      onClick={() => handleMoveToCart(item)}
                    >
                      <FiShoppingBag /> Move to Cart
                    </button>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeFromWishlist(item.product_id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
