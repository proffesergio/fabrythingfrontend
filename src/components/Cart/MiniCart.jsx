import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import styles from './MiniCart.module.css';

const MiniCart = ({ onClose }) => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className={styles.miniCart}>
        <div className={styles.empty}>
          <FiShoppingBag className={styles.emptyIcon} />
          <p>Your cart is empty</p>
          <Link to="/products" className={styles.shopNow} onClick={onClose}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.miniCart}>
      <div className={styles.header}>
        <h3>Shopping Cart ({cartItems.length})</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          <FiX />
        </button>
      </div>

      <div className={styles.items}>
        {cartItems.map((item) => {
          const product = item.product || {};
          const image = product.image || product.image_url || 'https://via.placeholder.com/80';
          const name = product.name || 'Product';
          const price = product.discount_price || product.price || 0;

          return (
            <div key={item.product_id || item.id} className={styles.item}>
              <div className={styles.itemImage}>
                <img src={image} alt={name} />
              </div>
              <div className={styles.itemDetails}>
                <Link
                  to={`/product/${item.product_id || item.id}`}
                  className={styles.itemName}
                  onClick={onClose}
                >
                  {name}
                </Link>
                <p className={styles.itemPrice}>${price.toFixed(2)}</p>
                <div className={styles.quantity}>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => removeFromCart(item.product_id)}
              >
                <FiX />
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <Link to="/cart" className={styles.viewCart} onClick={onClose}>
          View Cart
        </Link>
        <Link to="/checkout" className={styles.checkout} onClick={onClose}>
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default MiniCart;
