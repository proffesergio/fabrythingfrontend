import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const shippingCost = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.05;
  const orderTotal = cartTotal + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    // In a real app, this would call an API
    setOrderPlaced(true);
    setCurrentStep(4);
  };

  if (orderPlaced) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <FiCheck />
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your order. You will receive a confirmation email shortly.</p>
            <p className={styles.orderNumber}>Order #FT{Date.now()}</p>
            <button onClick={() => navigate('/')} className={styles.homeBtn}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Checkout', path: '/checkout' }]} />

        <h1 className={styles.title}>Checkout</h1>

        {/* Progress Steps */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Shipping</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Review</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            {/* Step 1: Shipping Address */}
            {currentStep >= 1 && (
              <div className={styles.section}>
                <h2>Shipping Address</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={shippingAddress.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={shippingAddress.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1234 567890"
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="Dhaka"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>District</label>
                    <input
                      type="text"
                      name="district"
                      value={shippingAddress.district}
                      onChange={handleInputChange}
                      placeholder="Gulshan"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      placeholder="1212"
                    />
                  </div>
                </div>
                {currentStep === 1 && (
                  <button
                    className={styles.nextBtn}
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep >= 2 && (
              <div className={styles.section}>
                <h2>Payment Method</h2>
                <div className={styles.paymentOptions}>
                  <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.active : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <FiDollarSign className={styles.paymentIcon} />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Cash on Delivery</span>
                      <span className={styles.paymentDesc}>Pay when you receive</span>
                    </div>
                  </label>

                  <label className={`${styles.paymentOption} ${paymentMethod === 'bkash' ? styles.active : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                    />
                    <FiSmartphone className={styles.paymentIcon} />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>bKash</span>
                      <span className={styles.paymentDesc}>Pay via bKash mobile wallet</span>
                    </div>
                  </label>

                  <label className={`${styles.paymentOption} ${paymentMethod === 'nagad' ? styles.active : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                    />
                    <FiSmartphone className={styles.paymentIcon} />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Nagad</span>
                      <span className={styles.paymentDesc}>Pay via Nagad mobile wallet</span>
                    </div>
                  </label>

                  <label className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.active : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <FiCreditCard className={styles.paymentIcon} />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Card Payment</span>
                      <span className={styles.paymentDesc}>Visa, Mastercard, etc.</span>
                    </div>
                  </label>
                </div>

                <div className={styles.btnGroup}>
                  <button
                    className={styles.backBtn}
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className={styles.nextBtn}
                    onClick={() => setCurrentStep(3)}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep >= 3 && (
              <div className={styles.section}>
                <h2>Order Review</h2>

                <div className={styles.orderItems}>
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    return (
                      <div key={item.product_id} className={styles.orderItem}>
                        <img
                          src={product.image || product.image_url || 'https://via.placeholder.com/60'}
                          alt={product.name}
                        />
                        <div className={styles.orderItemInfo}>
                          <span className={styles.orderItemName}>{product.name}</span>
                          <span className={styles.orderItemQty}>Qty: {item.quantity}</span>
                        </div>
                        <span className={styles.orderItemPrice}>
                          ${((product.discount_price || product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className={styles.btnGroup}>
                  <button
                    className={styles.backBtn}
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                  <button
                    className={styles.placeOrderBtn}
                    onClick={handlePlaceOrder}
                  >
                    Place Order - ${orderTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className={styles.summary}>
            <h3>Order Summary</h3>

            <div className={styles.summaryItems}>
              {cartItems.map((item) => {
                const product = item.product || {};
                const price = product.discount_price || product.price || 0;
                return (
                  <div key={item.product_id} className={styles.summaryItem}>
                    <img
                      src={product.image || product.image_url || 'https://via.placeholder.com/50'}
                      alt={product.name}
                    />
                    <div>
                      <span className={styles.summaryName}>{product.name}</span>
                      <span className={styles.summaryQty}>x{item.quantity}</span>
                    </div>
                    <span>${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
