import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import CategoryShowcase from '../components/Home/CategoryShowcase';
import FeaturedProducts from '../components/Home/FeaturedProducts';
import NewArrivals from '../components/Home/NewArrivals';
import SpecialOffers from '../components/Home/SpecialOffers';
import ValueProposition from '../components/Home/ValueProposition';
import BrandShowcase from '../components/Home/BrandShowcase';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <HeroSection />

      {/* Value Proposition */}
      <ValueProposition />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Special Offers Banner */}
      <SpecialOffers />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Brand Showcase */}
      <BrandShowcase />
    </div>
  );
};

export default HomePage;
