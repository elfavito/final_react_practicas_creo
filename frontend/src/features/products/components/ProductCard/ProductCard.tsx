import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../../../types';
import { Card } from '../../../../components/ui/Card/Card';
import { Button } from '../../../../components/ui/Button/Button';
import { StockBadge } from '../StockBadge/StockBadge';
import { Star } from 'lucide-react';
import { useAppDispatch } from '../../../../store/store';
import { addToCart } from '../../../cart/slice/cartSlice';
import styles from './ProductCard.module.css';

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
    <Card hoverable className={styles.card}>
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        <div className={styles.imageWrapper}>
          <img
            src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.nombre)}`}
            alt={product.nombre}
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <span className={styles.category}>{product.categoria}</span>
          <div className={styles.header}>
            <h3 className={styles.title}>{product.nombre}</h3>
            <div className={styles.rating}>
              <Star size={16} fill="currentColor" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>
          <span className={styles.price}>${product.precio.toFixed(2)}</span>
          <StockBadge stock={product.stock_actual} className={styles.stockBadge} />
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
