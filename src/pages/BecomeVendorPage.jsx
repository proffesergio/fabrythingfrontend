import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiShoppingBag, FiUsers, FiTrendingUp, FiShield, FiStar,
  FiArrowRight, FiArrowLeft, FiCheck, FiUpload, FiX,
  FiFileText, FiDollarSign
} from 'react-icons/fi';
import VendorService from '../services/vendorService';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './BecomeVendorPage.module.css';

const vendorSchema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  business_type: z.string().min(1, 'Business type is required'),
  business_address: z.string().min(10, 'Business address is required'),
  phone: z.string().min(5, 'Phone number is required'),
  tax_id: z.string().min(5, 'Tax ID/TIN is required'),
  payout_method: z.string().min(1, 'Payout method is required'),
  payout_account: z.string().min(5, 'Account number is required'),
  payout_account_confirm: z.string(),
}).refine((data) => data.payout_account === data.payout_account_confirm, {
  message: "Account numbers don't match",
  path: ['payout_account_confirm'],
});

const businessTypes = [
  { value: 'individual', label: 'Individual' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'company', label: 'Company' },
  { value: 'corporation', label: 'Corporation' },
];

const payoutMethods = [
  { value: 'bkash', label: 'bKash', icon: '💳' },
  { value: 'nagad', label: 'Nagad', icon: '💳' },
  { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
];

const BecomeVendorPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    business_address: '',
    phone: '',
    tax_id: '',
    nid_document: null,
    trade_license: null,
    tin_certificate: null,
    payout_method: '',
    payout_account: '',
    payout_account_confirm: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: formData,
  });

  const onDropNid = useCallback((acceptedFiles) => {
    setFormData(prev => ({ ...prev, nid_document: acceptedFiles[0] }));
    setValue('nid_document', acceptedFiles[0]);
  }, [setValue]);

  const onDropTradeLicense = useCallback((acceptedFiles) => {
    setFormData(prev => ({ ...prev, trade_license: acceptedFiles[0] }));
    setValue('trade_license', acceptedFiles[0]);
  }, [setValue]);

  const onDropTin = useCallback((acceptedFiles) => {
    setFormData(prev => ({ ...prev, tin_certificate: acceptedFiles[0] }));
    setValue('tin_certificate', acceptedFiles[0]);
  }, [setValue]);

  const nidDropzone = useDropzone({
    onDrop: onDropNid,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const tradeLicenseDropzone = useDropzone({
    onDrop: onDropTradeLicense,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const tinDropzone = useDropzone({
    onDrop: onDropTin,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValue(name, value);
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['business_name', 'business_type', 'business_address', 'phone', 'tax_id'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['nid_document'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['payout_method', 'payout_account', 'payout_account_confirm'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formDataToSubmit = new FormData();

      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          formDataToSubmit.append(key, formData[key]);
        } else if (formData[key]) {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      await VendorService.submitApplication(formDataToSubmit);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Breadcrumb items={[{ label: 'Become a Vendor', path: '/become-vendor' }]} />
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>
              <FiCheck />
            </div>
            <h2>Application Submitted Successfully!</h2>
            <p>
              Your vendor application has been submitted and is now pending review.
              We will notify you once your application has been processed.
            </p>
            <div className={styles.successActions}>
              <Link to="/vendor/status" className={styles.primaryBtn}>
                Check Application Status
              </Link>
              <Link to="/" className={styles.secondaryBtn}>
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && currentStep === 1) {
    return <LandingPage onGetStarted={() => navigate('/register?vendor=true')} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Become a Vendor', path: '/become-vendor' }]} />

        <div className={styles.progressContainer}>
          <div className={styles.progressSteps}>
            {[
              { num: 1, label: 'Business Info', icon: FiFileText },
              { num: 2, label: 'Documents', icon: FiUpload },
              { num: 3, label: 'Payout', icon: FiDollarSign },
              { num: 4, label: 'Review', icon: FiCheck },
            ].map((step) => (
              <div
                key={step.num}
                className={`${styles.progressStep} ${currentStep >= step.num ? styles.active : ''} ${currentStep > step.num ? styles.completed : ''}`}
              >
                <div className={styles.stepIcon}>
                  {currentStep > step.num ? <FiCheck /> : <step.icon />}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formContainer}>
          {submitError && (
            <div className={styles.errorAlert}>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className={styles.formStep}>
                <h2>Business Information</h2>
                <p className={styles.stepDescription}>
                  Tell us about your business to get started
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="business_name">Business Name *</label>
                    <input
                      type="text"
                      id="business_name"
                      {...register('business_name')}
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      className={errors.business_name ? styles.error : ''}
                    />
                    {errors.business_name && (
                      <span className={styles.fieldError}>{errors.business_name.message}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="business_type">Business Type *</label>
                    <select
                      id="business_type"
                      {...register('business_type')}
                      value={formData.business_type}
                      onChange={handleChange}
                      className={errors.business_type ? styles.error : ''}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.business_type && (
                      <span className={styles.fieldError}>{errors.business_type.message}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className={errors.phone ? styles.error : ''}
                    />
                    {errors.phone && (
                      <span className={styles.fieldError}>{errors.phone.message}</span>
                    )}
                  </div>

                  <div className={styles.formGroupFull}>
                    <label htmlFor="business_address">Business Address *</label>
                    <textarea
                      id="business_address"
                      {...register('business_address')}
                      value={formData.business_address}
                      onChange={handleChange}
                      placeholder="Enter your complete business address"
                      rows={3}
                      className={errors.business_address ? styles.error : ''}
                    />
                    {errors.business_address && (
                      <span className={styles.fieldError}>{errors.business_address.message}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="tax_id">Tax ID / TIN *</label>
                    <input
                      type="text"
                      id="tax_id"
                      {...register('tax_id')}
                      value={formData.tax_id}
                      onChange={handleChange}
                      placeholder="Enter your TIN number"
                      className={errors.tax_id ? styles.error : ''}
                    />
                    {errors.tax_id && (
                      <span className={styles.fieldError}>{errors.tax_id.message}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className={styles.formStep}>
                <h2>Upload Documents</h2>
                <p className={styles.stepDescription}>
                  Please upload the required documents for verification
                </p>

                <div className={styles.formGrid}>
                  <div className={styles.formGroupFull}>
                    <label>National ID (NID) *</label>
                    <div
                      {...nidDropzone.getRootProps()}
                      className={`${styles.dropzone} ${nidDropzone.isDragActive ? styles.dragActive : ''} ${formData.nid_document ? styles.hasFile : ''} ${errors.nid_document ? styles.error : ''}`}
                    >
                      <input {...nidDropzone.getInputProps()} />
                      {formData.nid_document ? (
                        <div className={styles.filePreview}>
                          <FiFileText className={styles.fileIcon} />
                          <span>{formData.nid_document.name}</span>
                          <button
                            type="button"
                            className={styles.removeFile}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, nid_document: null }));
                              setValue('nid_document', null);
                            }}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.dropzoneContent}>
                          <FiUpload className={styles.uploadIcon} />
                          <p>Drag & drop your NID here or click to browse</p>
                          <span>Supports: JPG, PNG, PDF (Max 5MB)</span>
                        </div>
                      )}
                    </div>
                    {errors.nid_document && (
                      <span className={styles.fieldError}>{errors.nid_document.message}</span>
                    )}
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Trade License (Optional)</label>
                    <div
                      {...tradeLicenseDropzone.getRootProps()}
                      className={`${styles.dropzone} ${tradeLicenseDropzone.isDragActive ? styles.dragActive : ''} ${formData.trade_license ? styles.hasFile : ''}`}
                    >
                      <input {...tradeLicenseDropzone.getInputProps()} />
                      {formData.trade_license ? (
                        <div className={styles.filePreview}>
                          <FiFileText className={styles.fileIcon} />
                          <span>{formData.trade_license.name}</span>
                          <button
                            type="button"
                            className={styles.removeFile}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, trade_license: null }));
                              setValue('trade_license', null);
                            }}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.dropzoneContent}>
                          <FiUpload className={styles.uploadIcon} />
                          <p>Drag & drop your Trade License or click to browse</p>
                          <span>Supports: JPG, PNG, PDF (Max 5MB)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>TIN Certificate (Optional)</label>
                    <div
                      {...tinDropzone.getRootProps()}
                      className={`${styles.dropzone} ${tinDropzone.isDragActive ? styles.dragActive : ''} ${formData.tin_certificate ? styles.hasFile : ''}`}
                    >
                      <input {...tinDropzone.getInputProps()} />
                      {formData.tin_certificate ? (
                        <div className={styles.filePreview}>
                          <FiFileText className={styles.fileIcon} />
                          <span>{formData.tin_certificate.name}</span>
                          <button
                            type="button"
                            className={styles.removeFile}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData(prev => ({ ...prev, tin_certificate: null }));
                              setValue('tin_certificate', null);
                            }}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.dropzoneContent}>
                          <FiUpload className={styles.uploadIcon} />
                          <p>Drag & drop your TIN Certificate or click to browse</p>
                          <span>Supports: JPG, PNG, PDF (Max 5MB)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={styles.formStep}>
                <h2>Payout Details</h2>
                <p className={styles.stepDescription}>
                  Choose how you want to receive your payments
                </p>

                <div className={styles.payoutMethods}>
                  {payoutMethods.map(method => (
                    <label
                      key={method.value}
                      className={`${styles.payoutMethod} ${formData.payout_method === method.value ? styles.selected : ''}`}
                    >
                      <input
                        type="radio"
                        name="payout_method"
                        value={method.value}
                        {...register('payout_method')}
                        checked={formData.payout_method === method.value}
                        onChange={handleChange}
                      />
                      <span className={styles.methodIcon}>{method.icon}</span>
                      <span className={styles.methodLabel}>{method.label}</span>
                    </label>
                  ))}
                </div>
                {errors.payout_method && (
                  <span className={styles.fieldError}>{errors.payout_method.message}</span>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="payout_account">
                      {formData.payout_method === 'bank' ? 'Bank Account Number' : 'Mobile Number'} *
                    </label>
                    <input
                      type="text"
                      id="payout_account"
                      {...register('payout_account')}
                      value={formData.payout_account}
                      onChange={handleChange}
                      placeholder={formData.payout_method === 'bank' ? 'Enter account number' : '01XXXXXXXXX'}
                      className={errors.payout_account ? styles.error : ''}
                    />
                    {errors.payout_account && (
                      <span className={styles.fieldError}>{errors.payout_account.message}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="payout_account_confirm">Confirm Account *</label>
                    <input
                      type="text"
                      id="payout_account_confirm"
                      {...register('payout_account_confirm')}
                      value={formData.payout_account_confirm}
                      onChange={handleChange}
                      placeholder="Confirm your account number"
                      className={errors.payout_account_confirm ? styles.error : ''}
                    />
                    {errors.payout_account_confirm && (
                      <span className={styles.fieldError}>{errors.payout_account_confirm.message}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className={styles.formStep}>
                <h2>Review & Submit</h2>
                <p className={styles.stepDescription}>
                  Please review your information before submitting
                </p>

                <div className={styles.reviewSection}>
                  <div className={styles.reviewGroup}>
                    <h4>Business Information</h4>
                    <div className={styles.reviewItems}>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Business Name</span>
                        <span className={styles.reviewValue}>{formData.business_name}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Business Type</span>
                        <span className={styles.reviewValue}>
                          {businessTypes.find(t => t.value === formData.business_type)?.label}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Business Address</span>
                        <span className={styles.reviewValue}>{formData.business_address}</span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Tax ID/TIN</span>
                        <span className={styles.reviewValue}>{formData.tax_id}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewGroup}>
                    <h4>Documents</h4>
                    <div className={styles.reviewItems}>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>NID Document</span>
                        <span className={styles.reviewValue}>
                          {formData.nid_document?.name || 'Not uploaded'}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Trade License</span>
                        <span className={styles.reviewValue}>
                          {formData.trade_license?.name || 'Not uploaded'}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>TIN Certificate</span>
                        <span className={styles.reviewValue}>
                          {formData.tin_certificate?.name || 'Not uploaded'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewGroup}>
                    <h4>Payout Details</h4>
                    <div className={styles.reviewItems}>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Payout Method</span>
                        <span className={styles.reviewValue}>
                          {payoutMethods.find(m => m.value === formData.payout_method)?.label}
                        </span>
                      </div>
                      <div className={styles.reviewItem}>
                        <span className={styles.reviewLabel}>Account Number</span>
                        <span className={styles.reviewValue}>{formData.payout_account}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.termsBox}>
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">
                    I agree to the <Link to="/terms">Terms & Conditions</Link> and{' '}
                    <Link to="/vendor-agreement">Vendor Agreement</Link>
                  </label>
                </div>
              </div>
            )}

            <div className={styles.formNavigation}>
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className={styles.backBtn}>
                  <FiArrowLeft /> Back
                </button>
              )}

              {currentStep < 4 ? (
                <button type="button" onClick={nextStep} className={styles.nextBtn}>
                  Continue <FiArrowRight />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onGetStarted }) => {
  const benefits = [
    { icon: FiShoppingBag, title: 'Easy Store Setup', description: 'Create your online store in minutes' },
    { icon: FiUsers, title: 'Reach More Customers', description: 'Access millions of monthly visitors' },
    { icon: FiTrendingUp, title: 'Low Commission', description: 'Competitive rates starting from 10%' },
    { icon: FiShield, title: 'Secure Payments', description: 'Get paid securely with bKash, Nagad' },
    { icon: FiStar, title: 'Quality Verification', description: 'Join verified vendors network' }
  ];

  const steps = [
    { number: '01', title: 'Register', description: 'Create your vendor account' },
    { number: '02', title: 'Verify', description: 'Submit documents for verification' },
    { number: '03', title: 'List Products', description: 'Add products with photos' },
    { number: '04', title: 'Start Selling', description: 'Go live immediately' }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Become a Vendor', path: '/become-vendor' }]} />

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Open Your Online Store
              <span className={styles.highlight}> Start Selling Today</span>
            </h1>
            <p className={styles.heroDescription}>
              Join thousands of vendors on Fabrything. Set up your store in minutes
              and reach millions of customers.
            </p>
            <div className={styles.heroCTAs}>
              <button onClick={onGetStarted} className={styles.primaryBtn}>
                Create Vendor Account <FiArrowRight />
              </button>
              <Link to="/vendors" className={styles.secondaryBtn}>
                View Vendor Stories
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.statNumber}>10K+</span>
                <span className={styles.statLabel}>Active Vendors</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.statNumber}>50K+</span>
                <span className={styles.statLabel}>Products</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.statNumber}>$1M+</span>
                <span className={styles.statLabel}>Sales This Month</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" alt="Vendor Dashboard" />
          </div>
        </section>

        <section className={styles.benefits}>
          <h2 className={styles.sectionTitle}>Why Sell on Fabrything?</h2>
          <p className={styles.sectionSubtitle}>Everything you need to grow your business</p>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>
                  <benefit.icon />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How to Get Started</h2>
          <p className={styles.sectionSubtitle}>Four simple steps to start your journey</p>
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Selling?</h2>
            <p>Join our growing community of vendors.</p>
            <ul className={styles.ctaFeatures}>
              <li><FiCheck /> No listing fees</li>
              <li><FiCheck /> Low commission rates</li>
              <li><FiCheck /> 24/7 support</li>
              <li><FiCheck /> Fast payouts</li>
            </ul>
            <button onClick={onGetStarted} className={styles.ctaBtn}>
              Open Your Store Now <FiArrowRight />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeVendorPage;
