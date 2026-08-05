import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../../store/store';
import { clearCart } from '../../slice/cartSlice';
import { CartTable } from '../../components/CartTable/CartTable';
import { CartSummary } from '../../components/CartSummary/CartSummary';
import { Button } from '../../../../components/ui/Button/Button';
import styles from './CartPage.module.css';

export const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, totalQuantity, totalAmount } = useAppSelector((state) => state.cart);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <ShoppingBag size={80} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
          <p className={styles.emptyText}>
            Agrega productos desde el catálogo para comenzar tu compra.
          </p>
          <Link to="/products">
            <Button size="lg">Explorar catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mi Carrito</h1>
        <p className={styles.subtitle}>{totalQuantity} {totalQuantity === 1 ? 'artículo' : 'artículos'}</p>
      </header>

      <div className={styles.content}>
        {/* Tabla de productos */}
        <section>
          <div className={styles.clearBtn}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(clearCart())}
              style={{ color: 'var(--color-danger)' }}
            >
              Vaciar carrito
            </Button>
          </div>
          <CartTable items={items} />
        </section>

        {/* Resumen */}
        <aside>
          <CartSummary
            totalQuantity={totalQuantity}
            totalAmount={totalAmount}
            isAuthenticated={isAuthenticated}
          />
        </aside>
      </div>
    </div>
  );
};
