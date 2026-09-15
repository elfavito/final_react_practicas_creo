import React from 'react';
import { getProductImage } from '../../utils/imageUtils';
import { Link } from 'react-router-dom';
import { Product } from '../../../../types';
import { Card } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import { StockBadge } from '../StockBadge/StockBadge';
import { Star } from 'lucide-react';
import { useAppDispatch } from '../../../../store/store';
import { addToCart } from '../../../cart/slice/cartSlice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Don't navigate to detail page
    dispatch(addToCart({ product, cantidad: 1 }));
  };

  return (
    <Card hoverable className="h-full group">
      <Link to={`/products/${product.id}`} className="no-underline text-inherit flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={getProductImage(product.id)}
            alt={product.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">{product.categoria}</span>
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 m-0 line-clamp-2">{product.nombre}</h3>
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-full text-xs font-medium">
              <Star size={12} fill="currentColor" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-auto pt-2">${product.precio.toFixed(2)}</span>
          <StockBadge stock={product.stock_actual} className="mt-2 w-fit" />
        </div>
      </Link>
      <Card.Footer>
        <Button
          fullWidth
          variant="primary"
          disabled={product.stock_actual === 0}
          onClick={handleAddToCart}
        >
          {product.stock_actual === 0 ? 'Agotado' : 'Agregar al carrito'}
        </Button>
      </Card.Footer>
    </Card>
  );
};
