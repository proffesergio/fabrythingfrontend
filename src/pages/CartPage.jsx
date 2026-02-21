import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, applyCoupon, cart, loading } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponError('');
    setCouponSuccess('');

    const result = await applyCoupon(couponCode);
    if (result.success) {
      setCouponSuccess('Coupon applied successfully!');
      setCouponCode('');
    } else {
      setCouponError(result.error || 'Invalid coupon code');
    }
  };

  const appliedCoupon = cart?.coupon || null;
  const discount = cart?.discount || 0;
  const finalTotal = cartTotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Shopping Cart', path: '/cart' }]} />

          <div className={styles.empty}>
            <FiShoppingBag className={styles.emptyIcon} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className={styles.shopBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Shopping Cart', path: '/cart' }]} />

        <h1 className={styles.title}>Shopping Cart ({cartItems.length} items)</h1>

        <div className={styles.content}>
          <div className={styles.items}>
            {cartItems.map((item) => {
              const product = item.product || {};
              const image = product.image || product.image_url || 'https://via.placeholder.com/100';
              const name = product.name || 'Product';
              const price = product.discount_price || product.price || 0;

              return (
                <div key={item.product_id || item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <img src={image} alt={name} />
                  </div>

                  <div className={styles.itemDetails}>
                    <Link to={`/product/${item.product_id || item.id}`} className={styles.itemName}>
                      {name}
                    </Link>
                    {item.variant && (
                      <p className={styles.itemVariant}>
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.color && ` / Color: ${item.variant.color}`}
                      </p>
                    )}
                    <div className={styles.itemMeta}>
                      <span className={styles.itemPrice}>${price.toFixed(2)}</span>
                      <div className={styles.itemQuantity}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>
                          <FiPlus />
                        </button>
                      </div>
                      <span className={styles.itemTotal}>${(price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <h3>Order Summary</h3>

            {/* Coupon Section */}
            <div className={styles.couponSection}>
              {appliedCoupon ? (
                <div className={styles.appliedCoupon}>
                  <FiTag className={styles.couponIcon} />
                  <span className={styles.couponCode}>{appliedCoupon.code}</span>
                  <span className={styles.couponDiscount}>-{discount.toFixed(2)}</span>
                  <button
                    className={styles.removeCouponBtn}
                    onClick={() => {
                      // Remove coupon - refresh cart
                      window.location.reload();
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <FiTag className={styles.couponInputIcon} />
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={styles.couponInput}
                  />
                  <button
                    type="submit"
                    className={styles.applyCouponBtn}
                    disabled={loading || !couponCode.trim()}
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className={styles.couponError}>{couponError}</p>}
              {couponSuccess && <p className={styles.couponSuccess}>{couponSuccess}</p>}
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className={`${styles.summaryRow} ${styles.discount}`}>
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${(finalTotal > 0 ? finalTotal : 0).toFixed(2)}</span>
            </div>

            <Link to="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>

            <Link to="/products" className={styles.continueBtn}>
              Continue Shopping
            </Link>

            <button className={styles.clearBtn} onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
