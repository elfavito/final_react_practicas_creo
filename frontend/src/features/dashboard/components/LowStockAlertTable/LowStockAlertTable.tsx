import React from 'react';
import type { LowStockProduct } from '../../hooks/useDashboard';
import './LowStockAlertTable.css';

interface LowStockAlertTableProps {
  data: LowStockProduct[];
  loading?: boolean;
}

const StockBadge: React.FC<{ actual: number; minimo: number }> = ({ actual, minimo }) => {
  const pct = minimo > 0 ? (actual / minimo) * 100 : 100;
  const label = actual === 0 ? 'Agotado' : 'Alerta';
  const cls = actual === 0 ? 'badge--danger' : 'badge--warning';

  return (
    <span className={`stock-badge ${cls}`}>
      <span className="stock-badge__dot" />
      {label}
      <span className="stock-badge__pct">({Math.round(pct)}%)</span>
    </span>
  );
};

export const LowStockAlertTable: React.FC<LowStockAlertTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="alert-table-card">
        <div className="alert-table-card__header">
          <div className="chart-card__title-skeleton" style={{ width: '40%' }} />
        </div>
        <div className="alert-table__skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="alert-table__skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="alert-table-card">
      <div className="alert-table-card__header">
        <h3 className="chart-card__title">
          ⚠️ Alertas de Stock Bajo
        </h3>
        <span className="alert-table__count">
          {data.length} producto{data.length !== 1 ? 's' : ''}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="alert-table__empty">
          <span className="alert-table__empty-icon">✅</span>
          <p>¡Todos los productos tienen stock suficiente!</p>
        </div>
      ) : (
        <div className="alert-table__wrapper">
          <table className="alert-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product.id} className="alert-table__row">
                  <td className="alert-table__name">{product.nombre}</td>
                  <td>
                    <code className="alert-table__sku">{product.sku}</code>
                  </td>
                  <td>
                    <span className="alert-table__categoria">{product.categoria}</span>
                  </td>
                  <td className={product.stock_actual === 0 ? 'alert-table__stock--zero' : 'alert-table__stock--low'}>
                    {product.stock_actual}
                  </td>
                  <td className="alert-table__minimo">{product.stock_minimo}</td>
                  <td>
                    <StockBadge actual={product.stock_actual} minimo={product.stock_minimo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
