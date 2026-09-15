import React from 'react';

interface StockBadgeProps {
  stock: number;
  className?: string;
  style?: React.CSSProperties;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ stock, className, style }) => {
  let statusClass = '';
  let indicatorClass = '';
  let text = '';

  if (stock > 5) {
    statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
    indicatorClass = 'bg-emerald-500';
    text = 'Disponible';
  } else if (stock > 0 && stock <= 5) {
    statusClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
    indicatorClass = 'bg-amber-500';
    text = '¡Últimas unidades!';
  } else {
    statusClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 opacity-80';
    indicatorClass = 'bg-red-500';
    text = 'Agotado';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass} ${className || ''}`} style={style}>
      <span className={`w-1.5 h-1.5 rounded-full ${indicatorClass}`}></span>
      {text}
    </div>
  );
};
