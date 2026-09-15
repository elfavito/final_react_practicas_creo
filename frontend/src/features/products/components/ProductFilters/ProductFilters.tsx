import React from 'react';
import { Input } from '../../../../components/ui/Input/Input';
import { Button } from '../../../../components/ui/Button/Button';
import { Filter } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-6 sticky top-24">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100 m-0 pb-3 border-b border-slate-100 dark:border-slate-700">
        <Filter size={20} className="text-indigo-500" />
        Filtros
      </h3>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 m-0">Búsqueda</h4>
        <Input 
          placeholder="Buscar productos..." 
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 m-0">Categoría</h4>
        <Input 
          placeholder="Ej: Electrónica" 
          value={filters.categoria || ''}
          onChange={(e) => handleChange('categoria', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 m-0">Rango de Precio</h4>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder="Min" 
            value={filters.min_precio || ''}
            onChange={(e) => handleChange('min_precio', e.target.value ? Number(e.target.value) : undefined)}
          />
          <span className="text-slate-400 font-medium">-</span>
          <Input 
            type="number" 
            placeholder="Max" 
            value={filters.max_precio || ''}
            onChange={(e) => handleChange('max_precio', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 m-0">Rating Mínimo</h4>
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
