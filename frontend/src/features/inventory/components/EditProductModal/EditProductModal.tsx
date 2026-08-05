import React, { useState } from 'react';
import type { Product } from '../../../../types';
import './EditProductModal.css';

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (id: number, updates: { stock_actual: number; stock_minimo: number; precio: number }) => void;
  isSaving: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  onClose,
  onSave,
  isSaving,
}) => {
  const [stockActual, setStockActual] = useState<string>(String(product?.stock_actual ?? ''));
  const [stockMinimo, setStockMinimo] = useState<string>(String(product?.stock_minimo ?? ''));
  const [precio, setPrecio] = useState<string>(String(product?.precio ?? ''));
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!product) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    const sa = Number(stockActual);
    const sm = Number(stockMinimo);
    const pr = Number(precio);

    if (isNaN(sa) || sa < 0) errs.stockActual = 'Debe ser un número ≥ 0';
    if (isNaN(sm) || sm < 0) errs.stockMinimo = 'Debe ser un número ≥ 0';
    if (isNaN(pr) || pr <= 0) errs.precio = 'Debe ser un número > 0';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(product.id, {
      stock_actual: Number(stockActual),
      stock_minimo: Number(stockMinimo),
      precio: Number(precio),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edición Rápida</h2>
            <p className="modal-subtitle">{product.nombre}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Product Info Badge */}
        <div className="modal-product-info">
          <span className="modal-sku">SKU: {product.sku}</span>
          <span className="modal-categoria">{product.categoria}</span>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form__row">
            {/* Stock Actual */}
            <div className="modal-form__field">
              <label htmlFor="stockActual" className="modal-form__label">
                Stock Actual
              </label>
              <input
                id="stockActual"
                type="number"
                min="0"
                step="1"
                className={`modal-form__input ${errors.stockActual ? 'modal-form__input--error' : ''}`}
                value={stockActual}
                onChange={(e) => {
                  setStockActual(e.target.value);
                  setErrors((prev) => ({ ...prev, stockActual: '' }));
                }}
              />
              {errors.stockActual && (
                <span className="modal-form__error">{errors.stockActual}</span>
              )}
            </div>

            {/* Stock Mínimo */}
            <div className="modal-form__field">
              <label htmlFor="stockMinimo" className="modal-form__label">
                Stock Mínimo
              </label>
              <input
                id="stockMinimo"
                type="number"
                min="0"
                step="1"
                className={`modal-form__input ${errors.stockMinimo ? 'modal-form__input--error' : ''}`}
                value={stockMinimo}
                onChange={(e) => {
                  setStockMinimo(e.target.value);
                  setErrors((prev) => ({ ...prev, stockMinimo: '' }));
                }}
              />
              {errors.stockMinimo && (
                <span className="modal-form__error">{errors.stockMinimo}</span>
              )}
            </div>
          </div>

          {/* Precio */}
          <div className="modal-form__field">
            <label htmlFor="precio" className="modal-form__label">
              Precio (ARS)
            </label>
            <div className="modal-form__input-wrapper">
              <span className="modal-form__prefix">$</span>
              <input
                id="precio"
                type="number"
                min="0.01"
                step="0.01"
                className={`modal-form__input modal-form__input--prefixed ${errors.precio ? 'modal-form__input--error' : ''}`}
                value={precio}
                onChange={(e) => {
                  setPrecio(e.target.value);
                  setErrors((prev) => ({ ...prev, precio: '' }));
                }}
              />
            </div>
            {errors.precio && (
              <span className="modal-form__error">{errors.precio}</span>
            )}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn--secondary" onClick={onClose} disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn--primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="modal-btn__spinner" />
                  Guardando…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
