import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { useAppDispatch } from '../../../../store/store';
import { Button } from '../../../../components/ui/Button/Button';
import { StockBadge } from '../../components/StockBadge/StockBadge';
import { ArrowLeft, Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import styles from './ProductDetailPage.module.css';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: product, isLoading, isError } = useProduct(Number(id));
  
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return <div className={styles.page}>Cargando...</div>;
  }

  if (isError || !product) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Producto no encontrado</h2>
          <Button onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  const handleIncrement = () => {
    if (quantity < product.stock_actual) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    // Dispatch add to cart action here
    console.log('Added to cart', { product, quantity });
  };

  const isOutOfStock = product.stock_actual === 0;

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.backLink}>
        <ArrowLeft size={20} />
        Volver al catálogo
      </Link>

      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <img 
            src={`https://via.placeholder.com/600x600?text=${encodeURIComponent(product.nombre)}`} 
            alt={product.nombre} 
            className={styles.image}
          />
        </div>

        <div className={styles.infoSection}>
          <span className={styles.category}>{product.categoria}</span>
          <h1 className={styles.title}>{product.nombre}</h1>
          
          <div className={styles.rating}>
            <Star size={20} fill="currentColor" />
            <span>{product.rating.toFixed(1)}</span>
            <StockBadge stock={product.stock_actual} style={{ marginLeft: '1rem' }} />
          </div>

          <div className={styles.price}>${product.precio.toFixed(2)}</div>
          
          <p className={styles.description}>
            {product.descripcion || 'Sin descripción disponible.'}
          </p>

          <div className={styles.purchaseSection}>
            <div className={styles.quantitySelector}>
              <span className={styles.quantityLabel}>Cantidad:</span>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityBtn} 
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  <Minus size={16} />
                </button>
                <span className={styles.quantityValue}>{isOutOfStock ? 0 : quantity}</span>
                <button 
                  className={styles.quantityBtn} 
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock_actual || isOutOfStock}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {product.stock_actual} disponibles
              </span>
            </div>

            <div className={styles.actions}>
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} style={{ marginRight: '0.5rem' }} />
                {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
