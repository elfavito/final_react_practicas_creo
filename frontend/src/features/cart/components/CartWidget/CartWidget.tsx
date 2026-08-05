import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAppSelector } from '../../../../store/store';
import styles from './CartWidget.module.css';

export const CartWidget: React.FC = () => {
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);

  return (
    <div className={styles.widget}>
      <Link to="/cart" className={styles.button} aria-label="Ver carrito">
        <ShoppingCart size={20} />
        <span>Carrito</span>
        {totalQuantity > 0 && (
          <span className={styles.badge} key={totalQuantity}>
            {totalQuantity > 99 ? '99+' : totalQuantity}
          </span>
        )}
      </Link>
    </div>
  );
};
