import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './Auth.module.css';
import { FaEnvelope, FaUser, FaPhone, FaLock, FaEye, FaEyeSlash, FaCheck, FaGoogle, FaFacebookF } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.first_name) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name) {
      errors.last_name = 'Last name is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.password_confirm) {
      errors.password_confirm = 'Please confirm password';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }

    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!acceptTerms) {
      errors.terms = 'You must accept the terms and conditions';
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
      const registrationData = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || '',
        password: formData.password,
        password_confirm: formData.password_confirm,
      };

      await register(registrationData);
      setRegisterSuccess(true);
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Registration successful! Please log in.' }
        });
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (registerSuccess) {
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
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <FaCheck />
              </div>
              <h2>Account Created!</h2>
              <p>Your account has been created successfully.</p>
              <p>Redirecting to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join us and discover exclusive fashion</p>

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


            {/* Username Field */}
            <div className={styles.inputContainer}>
              <div className={styles.inputIconWrapper}>
                <FaUser />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className={`${styles.inputField} ${validationErrors.username ? styles.inputError : ''}`}
                placeholder=" "
                autoComplete="username"
              />
              <label htmlFor="username" className={styles.floatingLabel}>Username</label>
            </div>
            {validationErrors.username && (
              <span className={styles.fieldError}>{validationErrors.username}</span>
            )}

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

            {/* Name Fields */}
            <div className={styles.formRow}>
              <div className={styles.inputContainer}>
                <div className={styles.inputIconWrapper}>
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${styles.inputField} ${validationErrors.first_name ? styles.inputError : ''}`}
                  placeholder=" "
                  autoComplete="given-name"
                />
                <label htmlFor="first_name" className={styles.floatingLabel}>First Name</label>
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.inputIconWrapper}>
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${styles.inputField} ${validationErrors.last_name ? styles.inputError : ''}`}
                  placeholder=" "
                  autoComplete="family-name"
                />
                <label htmlFor="last_name" className={styles.floatingLabel}>Last Name</label>
              </div>
            </div>
            {(validationErrors.first_name || validationErrors.last_name) && (
              <span className={styles.fieldError}>
                {validationErrors.first_name || validationErrors.last_name}
              </span>
            )}

            {/* Phone Field */}
            <div className={styles.inputContainer}>
              <div className={styles.inputIconWrapper}>
                <FaPhone />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className={`${styles.inputField} ${validationErrors.phone ? styles.inputError : ''}`}
                placeholder=" "
                autoComplete="tel"
              />
              <label htmlFor="phone" className={styles.floatingLabel}>Phone (Optional)</label>
            </div>
            {validationErrors.phone && (
              <span className={styles.fieldError}>{validationErrors.phone}</span>
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
                autoComplete="new-password"
              />
              <label htmlFor="password" className={styles.floatingLabel}>Password (min 8 chars)</label>
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

            {/* Confirm Password Field */}
            <div className={styles.inputContainer}>
              <div className={styles.inputIconWrapper}>
                <FaLock />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                disabled={loading}
                className={`${styles.inputField} ${validationErrors.password_confirm ? styles.inputError : ''}`}
                placeholder=" "
                autoComplete="new-password"
              />
              <label htmlFor="password_confirm" className={styles.floatingLabel}>Confirm Password</label>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.password_confirm && (
              <span className={styles.fieldError}>{validationErrors.password_confirm}</span>
            )}

            {/* Terms Checkbox */}
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <span className={styles.termsText}>
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </span>
            </label>
            {validationErrors.terms && (
              <span className={styles.fieldError}>{validationErrors.terms}</span>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Links */}
          <div className={styles.links}>
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
