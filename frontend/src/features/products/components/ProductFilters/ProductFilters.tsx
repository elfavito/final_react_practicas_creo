import React from 'react';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Filter } from 'lucide-react';
import styles from './ProductFilters.module.css';
import { UseProductsFilters } from '../../hooks/useProducts';

interface ProductFiltersProps {
  filters: UseProductsFilters;
  onFilterChange: (newFilters: UseProductsFilters) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const handleChange = (key: keyof UseProductsFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value, skip: 0 }); // Reset pagination on filter change
  };

  const handleClear = () => {
    onFilterChange({ skip: 0, limit: 12 });
  };

  return (
    <div className={styles.filters}>
      <h3 className={styles.title}>
        <Filter size={20} />
        Filtros
      </h3>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Búsqueda</h4>
        <Input 
          placeholder="Buscar productos..." 
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Categoría</h4>
        <Input 
          placeholder="Ej: Electrónica" 
          value={filters.categoria || ''}
          onChange={(e) => handleChange('categoria', e.target.value)}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Rango de Precio</h4>
        <div className={styles.priceRange}>
          <Input 
            type="number" 
            placeholder="Min" 
            value={filters.min_precio || ''}
            onChange={(e) => handleChange('min_precio', e.target.value ? Number(e.target.value) : undefined)}
          />
          <span className={styles.priceSeparator}>-</span>
          <Input 
            type="number" 
            placeholder="Max" 
            value={filters.max_precio || ''}
            onChange={(e) => handleChange('max_precio', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Rating Mínimo</h4>
        <Input 
          type="number" 
          step="0.1"
          min="0"
          max="5"
          placeholder="0.0 - 5.0" 
          value={filters.min_rating || ''}
          onChange={(e) => handleChange('min_rating', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <Button variant="secondary" onClick={handleClear} fullWidth>
        Limpiar Filtros
      </Button>
    </div>
  );
};
