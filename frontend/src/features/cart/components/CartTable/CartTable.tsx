import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../../../types';
import { useAppDispatch } from '../../../../store/store';
import { removeFromCart, updateQuantity } from '../../slice/cartSlice';
import styles from './CartTable.module.css';

interface CartTableProps {
  items: CartItem[];
}

export const CartTable: React.FC<CartTableProps> = ({ items }) => {
  const dispatch = useAppDispatch();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    dispatch(updateQuantity({ productId, cantidad: newQuantity }));
  };

  const handleRemove = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isAtMax = item.cantidad >= item.product.stock_actual;

            return (
              <tr key={item.product.id}>
                {/* Producto */}
                <td>
                  <div className={styles.productCell}>
                    <img
                      src={`https://via.placeholder.com/60x60?text=${encodeURIComponent(item.product.nombre.slice(0, 2))}`}
                      alt={item.product.nombre}
                      className={styles.productImg}
                    />
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{item.product.nombre}</span>
                      <span className={styles.productCategory}>{item.product.categoria}</span>
                    </div>
                  </div>
                </td>

                {/* Precio unitario */}
                <td>
                  <span className={styles.price}>${item.product.precio.toFixed(2)}</span>
                </td>

                {/* Control de cantidad */}
                <td>
                  <div>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleQuantityChange(item.product.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={styles.quantityValue}>{item.cantidad}</span>
                      <button
                        className={styles.quantityBtn}
                        onClick={() => handleQuantityChange(item.product.id, item.cantidad + 1)}
                        disabled={isAtMax}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {isAtMax && (
                      <p className={styles.stockWarning}>
                        Máximo disponible: {item.product.stock_actual}
                      </p>
                    )}
                  </div>
                </td>

                {/* Subtotal */}
                <td>
                  <span className={styles.subtotal}>
                    ${(item.product.precio * item.cantidad).toFixed(2)}
                  </span>
                </td>

                {/* Eliminar */}
                <td>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(item.product.id)}
                    aria-label={`Eliminar ${item.product.nombre}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
