import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './Auth.module.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Brand Side - Visible on Desktop */}
      <div className={styles.brandSide}>
        <div className={styles.brandBackground}></div>
        <div className={styles.brandPattern}></div>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>FABRYTHING</div>
          <div className={styles.brandAccent}></div>
          <p className={styles.brandTagline}>
            Elevate your style with timeless elegance
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          {/* Mobile Logo */}
          <div className={styles.mobileLogo}>
            <Link to="/" className={styles.mobileLogoLink}>FABRYTHING</Link>
          </div>

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to access your account</p>

          {/* Error Alert */}
          {error && (
            <div className={styles.errorAlert}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span style={{ flex: 1 }}>{error}</span>
              <button
                type="button"
                onClick={clearError}
                className={styles.closeError}
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Social Login */}
            <div className={styles.socialButtons}>
              <button type="button" className={styles.socialBtn}>
                <FaGoogle />
                Google
              </button>
              <button type="button" className={styles.socialBtn}>
                <FaFacebookF />
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className={styles.divider}>
              <span>or</span>
            </div>

            {/* Email Field */}
            <div className={styles.inputContainer}>
              <div className={styles.inputIconWrapper}>
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className={`${styles.inputField} ${validationErrors.email ? styles.inputError : ''}`}
                placeholder=" "
                autoComplete="email"
              />
              <label htmlFor="email" className={styles.floatingLabel}>Email Address</label>
            </div>
            {validationErrors.email && (
              <span className={styles.fieldError}>{validationErrors.email}</span>
            )}

            {/* Password Field */}
            <div className={styles.inputContainer}>
              <div className={styles.inputIconWrapper}>
                <FaLock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className={`${styles.inputField} ${validationErrors.password ? styles.inputError : ''}`}
                placeholder=" "
                autoComplete="current-password"
              />
              <label htmlFor="password" className={styles.floatingLabel}>Password</label>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.password && (
              <span className={styles.fieldError}>{validationErrors.password}</span>
            )}

            {/* Remember & Forgot */}
            <div className={styles.rememberRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Links */}
          <div className={styles.links}>
            <p>
              Don't have an account?{' '}
              <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
