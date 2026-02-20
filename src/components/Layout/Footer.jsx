import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Main Footer */}
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Company Info */}
            <div className={styles.column}>
              <Link to="/" className={styles.logo}>
                <img src="/logo_horizon.png" alt="Fabrything" className={styles.logoImage} />
              </Link>
              <p className={styles.description}>
                Your premier destination for quality fashion, footwear, and premium skincare.
                Verified products from trusted vendors.
              </p>
              <div className={styles.social}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FiFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FiInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FiTwitter />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <FiYoutube />
                </a>
              </div>
              <Link to="/become-vendor" className={styles.vendorCTA}>
                Open Your Store
              </Link>
            </div>

            {/* Quick Links */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Quick Links</h4>
              <ul className={styles.links}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Shop</Link></li>
                <li><Link to="/products?category=men">Men's Collection</Link></li>
                <li><Link to="/products?category=women">Women's Collection</Link></li>
                <li><Link to="/vendors">Become a Vendor</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Customer Service</h4>
              <ul className={styles.links}>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Contact Us</h4>
              <ul className={styles.contactInfo}>
                <li>
                  <FiMapPin />
                  <span>123 Fashion Street, Dhaka, Bangladesh</span>
                </li>
                <li>
                  <FiPhone />
                  <span>+880 1234 567890</span>
                </li>
                <li>
                  <FiMail />
                  <span>support@fabrything.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Newsletter</h4>
              <p className={styles.newsletterText}>
                Subscribe to get special offers and exclusive deals
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={styles.bottomFooter}>
        <div className={styles.container}>
          <p className={styles.copyright}>
            &copy; {currentYear} Fabrything. All rights reserved.
          </p>
          <div className={styles.payments}>
            <span>We accept:</span>
            <div className={styles.paymentIcons}>
              <span className={styles.paymentIcon}>bKash</span>
              <span className={styles.paymentIcon}>Nagad</span>
              <span className={styles.paymentIcon}>Visa</span>
              <span className={styles.paymentIcon}>Mastercard</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
