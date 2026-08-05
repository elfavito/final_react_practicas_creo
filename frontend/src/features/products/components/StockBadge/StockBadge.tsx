import React from 'react';
import styles from './StockBadge.module.css';

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock, className }) => {
  let statusClass = '';
  let text = '';

  if (stock > 5) {
    statusClass = styles.available;
    text = 'Disponible';
  } else if (stock > 0 && stock <= 5) {
    statusClass = styles.low;
    text = '¡Últimas unidades!';
  } else {
    statusClass = styles.outOfStock;
    text = 'Agotado';
  }

  return (
    <div className={`${styles.stockBadge} ${statusClass} ${className || ''}`}>
      <span className={styles.indicator}></span>
      {text}
    </div>
  );
};
