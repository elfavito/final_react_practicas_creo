import React from 'react';
import { Product } from '../../../../types';
import { ProductCard } from '../ProductCard/ProductCard';
import { PackageOpen } from 'lucide-react';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <PackageOpen size={48} className={styles.emptyIcon} />
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros para ver más resultados.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
