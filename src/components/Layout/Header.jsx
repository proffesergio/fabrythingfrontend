import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX,
  FiChevronRight, FiChevronDown, FiPhone, FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import MiniCart from '../Cart/MiniCart';
import styles from './Header.module.css';

// Category data with hierarchy
const categories = [
  {
    name: "Men's World",
    icon: '👔',
    subcategories: [
      {
        name: "Men's Fashion",
        items: ['Shirts', 'T-Shirts', 'Pants', 'Shorts', 'Trousers', 'Windbreakers', 'Jackets', 'Suits']
      },
      {
        name: 'Footwear',
        items: ['Shoes', 'Sneakers', 'Boots', 'Sandals', 'Formal Shoes', 'Sports Shoes']
      },
      {
        name: 'Accessories',
        items: ['Glasses', 'Wallets', 'Watches', 'Belts', 'Hats', 'Ties']
      },
      {
        name: 'Innerwear',
        items: ['Underwear', 'Socks', 'Sleepwear', 'Vests']
      }
    ]
  },
  {
    name: "Women's World",
    icon: '👗',
    subcategories: [
      {
        name: "Women's Fashion",
        items: ['Dresses', 'Tops', 'Blouses', 'Pants', 'Skirts', 'Jackets', 'Sarees']
      },
      {
        name: 'Skin Care',
        items: ['Moisturizers', 'Sunscreen', 'Serums', 'Face Masks', 'Cleansers']
      },
      {
        name: 'Hair Care',
        items: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Masks', 'Styling Products']
      },
      {
        name: 'Beauty',
        items: ['Makeup', 'Lipstick', 'Foundation', 'Mascara', 'Nail Polish']
      }
    ]
  },
  {
    name: "Kid's Zone",
    icon: '🧸',
    subcategories: [
      {
        name: "Kid's Fashion",
        items: ['Boys Clothing', 'Girls Clothing', 'Kids Shoes', 'Kids Accessories']
      },
      {
        name: 'Toys & Games',
        items: ['Action Figures', 'Building Blocks', 'Puzzles', 'Board Games', 'Remote Control']
      },
      {
        name: 'Baby Care',
        items: ['Diapers', 'Baby Food', 'Strollers', 'Car Seats', 'Baby Toys']
      }
    ]
  },
  {
    name: 'Electronics',
    icon: '📱',
    subcategories: [
      {
        name: 'Mobile & Gadgets',
        items: ['Smartphones', 'Tablets', 'Smartwatches', 'Headphones']
      },
      {
        name: 'Accessories',
        items: ['Phone Cases', 'Chargers', 'Power Banks', 'Data Cables']
      }
    ]
  }
];

const Header = ({ toggleMobileMenu }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartRef = useRef(null);
  const userMenuRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Quick category navigation
  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.toLowerCase().replace(/'/g, '').replace(/ /g, '-')}`);
    setIsMegaMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div className={styles.topBarLeft}>
            <span className={styles.welcomeText}>
              Welcome to Fabrything - Quality Verified Products
            </span>
          </div>
          <div className={styles.topBarRight}>
            <a href="tel:+8801234567890" className={styles.topBarLink}>
              <FiPhone /> +880 1234 567890
            </a>
            {user?.role !== 'vendor' && (
              <Link to="/become-vendor" className={styles.vendorLink}>
                <FiTrendingUp /> Become a Vendor
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.container}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <img src="/logo_black_horizon.png" alt="Fabrything" className={styles.logoImage} />
          </Link>

          {/* Mega Menu Toggle */}
          <div className={styles.megaMenuWrapper} ref={megaMenuRef}>
            <button
              className={styles.megaMenuToggle}
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            >
              <FiMenu />
              <span>All Categories</span>
              <FiChevronDown className={isMegaMenuOpen ? styles.rotated : ''} />
            </button>

            {isMegaMenuOpen && (
              <div className={styles.megaMenu}>
                <div className={styles.megaMenuCategories}>
                  {categories.map((category, idx) => (
                    <div
                      key={idx}
                      className={`${styles.megaMenuCategory} ${activeCategory === idx ? styles.active : ''}`}
                      onMouseEnter={() => setActiveCategory(idx)}
                    >
                      <span className={styles.categoryIcon}>{category.icon}</span>
                      <span className={styles.categoryName}>{category.name}</span>
                      <FiChevronRight className={styles.categoryArrow} />
                    </div>
                  ))}
                </div>

                <div className={styles.megaMenuContent}>
                  {activeCategory !== null && categories[activeCategory] && (
                    <>
                      <h4 className={styles.megaMenuTitle}>
                        {categories[activeCategory].name}
                      </h4>
                      <div className={styles.subCategories}>
                        {categories[activeCategory].subcategories.map((sub, idx) => (
                          <div key={idx} className={styles.subCategory}>
                            <h5>{sub.name}</h5>
                            <ul>
                              {sub.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    to={`/products?category=${item.toLowerCase().replace(/ /g, '-')}`}
                                    onClick={() => setIsMegaMenuOpen(false)}
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className={`${styles.searchWrapper} ${isSearchFocused ? styles.focused : ''}`}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchBtn}>
                <FiSearch />
              </button>
            </form>

            {/* Live Search Results */}
            {isSearchFocused && searchQuery.length > 1 && (
              <div className={styles.searchResults}>
                <div className={styles.searchSection}>
                  <h6>Popular Searches</h6>
                  <Link to={`/products?search=${searchQuery}`}>"{searchQuery}"</Link>
                  <Link to="/products?category=men">Men's Clothing</Link>
                  <Link to="/products?category=women">Women's Fashion</Link>
                </div>
                <div className={styles.searchSection}>
                  <h6>Categories</h6>
                  <Link to={`/products?category=${searchQuery}`}>{searchQuery}</Link>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Wishlist */}
            <Link to="/wishlist" className={styles.actionBtn} aria-label="Wishlist">
              <FiHeart />
              {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <div className={styles.cartWrapper} ref={cartRef}>
              <button
                className={styles.actionBtn}
                onClick={() => setIsCartOpen(!isCartOpen)}
                aria-label="Cart"
              >
                <FiShoppingCart />
                {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
              </button>
              {isCartOpen && <MiniCart onClose={() => setIsCartOpen(false)} />}
            </div>

            {/* User Menu */}
            <div className={styles.userWrapper} ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    className={styles.actionBtn}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Account"
                  >
                    <FiUser />
                  </button>
                  {isUserMenuOpen && (
                    <div className={styles.userMenu}>
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.name || user?.email}</p>
                      </div>
                      <Link to="/dashboard" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        My Dashboard
                      </Link>
                      <Link to="/orders" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        My Orders
                      </Link>
                      <Link to="/wishlist" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        Wishlist
                      </Link>
                      <Link to="/addresses" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        Address Book
                      </Link>
                      {user?.role === 'vendor' && (
                        <Link to="/vendor/dashboard" className={styles.menuItem} onClick={() => setIsUserMenuOpen(false)}>
                          Vendor Dashboard
                        </Link>
                      )}
                      <button className={styles.menuItem} onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className={styles.loginBtn}>
                  <FiUser /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Offers Bar */}
      <div className={styles.offersBar}>
        <div className={styles.offersContent}>
          <div className={styles.offerItem}>
            <span className={styles.hotTag}>HOT</span>
            <Link to="/products?category=skincare">Free Shipping on Orders $50+</Link>
          </div>
          <div className={styles.offerItem}>
            <span className={styles.saleTag}>SALE</span>
            <Link to="/products?sale=true">Up to 50% Off - End of Season Sale</Link>
          </div>
          <div className={styles.offerItem}>
            <span className={styles.newTag}>NEW</span>
            <Link to="/become-vendor">Open Your Store Today - Low Commission</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
