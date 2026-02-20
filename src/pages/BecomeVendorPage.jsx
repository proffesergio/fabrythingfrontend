import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiTrendingUp, FiShield, FiStar, FiArrowRight, FiCheck } from 'react-icons/fi';
import Breadcrumb from '../components/Common/Breadcrumb';
import styles from './BecomeVendorPage.module.css';

const BecomeVendorPage = () => {
  const benefits = [
    {
      icon: FiShoppingBag,
      title: 'Easy Store Setup',
      description: 'Create your online store in minutes with our intuitive dashboard'
    },
    {
      icon: FiUsers,
      title: 'Reach More Customers',
      description: 'Access our millions of monthly visitors looking for quality products'
    },
    {
      icon: FiTrendingUp,
      title: 'Low Commission',
      description: 'Competitive rates starting from just 5% per sale'
    },
    {
      icon: FiShield,
      title: 'Secure Payments',
      description: 'Get paid securely with bKash, Nagad, and card payments'
    },
    {
      icon: FiStar,
      title: 'Quality Verification',
      description: 'Join our network of verified vendors with premium products'
    }
  ];

  const steps = [
    { number: '01', title: 'Register', description: 'Create your vendor account in seconds' },
    { number: '02', title: 'Verify', description: 'Submit your business documents for verification' },
    { number: '03', title: 'List Products', description: 'Add your products with photos and descriptions' },
    { number: '04', title: 'Start Selling', description: 'Go live and start receiving orders immediately' }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Become a Vendor', path: '/become-vendor' }]} />

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Open Your Online Store
              <span className={styles.highlight}> Start Selling Today</span>
            </h1>
            <p className={styles.heroDescription}>
              Join thousands of vendors on Fabrything. Set up your store in minutes
              and reach millions of customers looking for quality products.
            </p>
            <div className={styles.heroCTAs}>
              <Link to="/register?vendor=true" className={styles.primaryBtn}>
                Create Vendor Account <FiArrowRight />
              </Link>
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
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
              alt="Vendor Dashboard"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefits}>
          <h2 className={styles.sectionTitle}>Why Sell on Fabrything?</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to grow your business
          </p>
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

        {/* How It Works */}
        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How to Get Started</h2>
          <p className={styles.sectionSubtitle}>
            Four simple steps to start your journey
          </p>
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

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Selling?</h2>
            <p>Join our growing community of vendors and start growing your business today.</p>
            <ul className={styles.ctaFeatures}>
              <li><FiCheck /> No listing fees</li>
              <li><FiCheck /> Low commission rates</li>
              <li><FiCheck /> 24/7 support</li>
              <li><FiCheck /> Fast payouts</li>
            </ul>
            <Link to="/register?vendor=true" className={styles.ctaBtn}>
              Open Your Store Now <FiArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeVendorPage;
