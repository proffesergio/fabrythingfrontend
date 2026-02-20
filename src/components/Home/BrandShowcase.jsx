import React from 'react';
import styles from './BrandShowcase.module.css';

const brands = [
  { name: 'Nike', logo: 'https://via.placeholder.com/150x50?text=Nike' },
  { name: 'Adidas', logo: 'https://via.placeholder.com/150x50?text=Adidas' },
  { name: 'Zara', logo: 'https://via.placeholder.com/150x50?text=Zara' },
  { name: 'H&M', logo: 'https://via.placeholder.com/150x50?text=H%26M' },
  { name: 'Uniqlo', logo: 'https://via.placeholder.com/150x50?text=Uniqlo' },
  { name: 'Levis', logo: 'https://via.placeholder.com/150x50?text=Levis' },
];

const BrandShowcase = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Top Brands</h2>
          <p className={styles.subtitle}>Quality from trusted names</p>
        </div>

        <div className={styles.brands}>
          {brands.map((brand, index) => (
            <div key={index} className={styles.brand}>
              <img src={brand.logo} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
