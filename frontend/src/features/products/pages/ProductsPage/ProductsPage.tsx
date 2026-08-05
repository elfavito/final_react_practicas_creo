import React, { useState } from 'react';
import { useProducts, UseProductsFilters } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { ProductFilters } from '../../components/ProductFilters/ProductFilters';
import { Button } from '../../../../components/ui/Button/Button';
import styles from './ProductsPage.module.css';

export const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<UseProductsFilters>({ skip: 0, limit: 12 });
  const { data, isLoading, isError } = useProducts(filters);

  const products = data?.items || [];
  const total = data?.total || 0;
  const skip = filters.skip || 0;
  const limit = filters.limit || 12;

  const handleNextPage = () => {
    if (skip + limit < total) {
      setFilters(prev => ({ ...prev, skip: skip + limit }));
    }
  };

  const handlePrevPage = () => {
    if (skip >= limit) {
      setFilters(prev => ({ ...prev, skip: skip - limit }));
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Catálogo de Productos</h1>
        <p className={styles.subtitle}>Descubre nuestra selección de artículos premium</p>
      </header>

      <div className={styles.content}>
        <aside>
          <ProductFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        <main>
          {isError ? (
            <div style={{ color: 'var(--color-danger)', textAlign: 'center', padding: '2rem' }}>
              Error al cargar los productos. Por favor intenta de nuevo.
            </div>
          ) : (
            <>
              <ProductGrid products={products} isLoading={isLoading} />
              
              {!isLoading && total > limit && (
                <div className={styles.pagination}>
                  <Button 
                    variant="secondary" 
                    disabled={skip === 0} 
                    onClick={handlePrevPage}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {Math.floor(skip / limit) + 1} de {Math.ceil(total / limit)}
                  </span>
                  <Button 
                    variant="secondary" 
                    disabled={skip + limit >= total} 
                    onClick={handleNextPage}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
