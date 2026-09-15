import React, { useState } from 'react';
import { useProducts, UseProductsFilters } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { ProductFilters } from '../../components/ProductFilters/ProductFilters';
import { Button } from '../../../../components/ui/Button/Button';
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
    <div className="flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-2 items-center text-center max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">Catálogo de Productos</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 m-0">Descubre nuestra selección de artículos premium</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        <aside className="w-full md:w-64 shrink-0">
          <ProductFilters filters={filters} onFilterChange={setFilters} />
        </aside>

        <main className="flex-1 min-w-0 w-full flex flex-col gap-8">
          {isError ? (
            <div className="text-red-500 text-center p-8 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20">
              Error al cargar los productos. Por favor intenta de nuevo.
            </div>
          ) : (
            <>
              <ProductGrid products={products} isLoading={isLoading} />
              
              {!isLoading && total > limit && (
                <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
                  <Button 
                    variant="secondary" 
                    disabled={skip === 0} 
                    onClick={handlePrevPage}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
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
