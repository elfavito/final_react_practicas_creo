import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button/Button';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  totalQuantity: number;
  totalAmount: number;
  isAuthenticated: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalQuantity,
  totalAmount,
  isAuthenticated,
}) => {
  const shipping = totalAmount > 0 ? 0 : 0; // Free shipping (can be calculated later)
  const tax = Number((totalAmount * 0.21).toFixed(2)); // Example 21% IVA
  const grandTotal = Number((totalAmount + shipping + tax).toFixed(2));

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Resumen del pedido</h2>

      <div className={styles.row}>
        <span className={styles.label}>Productos ({totalQuantity})</span>
        <span className={styles.value}>${totalAmount.toFixed(2)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Envío</span>
        <span className={styles.value} style={{ color: 'var(--color-success)' }}>
          Gratis
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>IVA (21%)</span>
        <span className={styles.value}>${tax.toFixed(2)}</span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>${grandTotal.toFixed(2)}</span>
      </div>

      <div className={styles.actions}>
        {isAuthenticated ? (
          <Link to="/checkout">
            <Button fullWidth size="lg" disabled={totalQuantity === 0}>
              Proceder al Checkout
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button fullWidth size="lg" disabled={totalQuantity === 0}>
                Iniciar sesión para comprar
              </Button>
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Necesitas una cuenta para finalizar la compra
            </p>
          </>
        )}

        <Link to="/products">
          <Button variant="ghost" fullWidth>
            Seguir comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};
