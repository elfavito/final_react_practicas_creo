import React, { useState, useCallback } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { InventoryTable } from '../../components/InventoryTable/InventoryTable';
import { EditProductModal } from '../../components/EditProductModal/EditProductModal';
import type { Product } from '../../../../types';
import './InventoryPage.css';

export const InventoryPage: React.FC = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { products, total, isLoading, isError, updateProduct, isUpdating } = useInventory({
    size: 100, // Load all for table-level filtering
  });

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setSuccessMsg(null);
  }, []);

  const handleSave = useCallback(
    (id: number, updates: { stock_actual: number; stock_minimo: number; precio: number }) => {
      updateProduct(
        { id, updates },
        {
          onSuccess: () => {
            setEditingProduct(null);
            setSuccessMsg(`Producto actualizado correctamente`);
            setTimeout(() => setSuccessMsg(null), 3500);
          },
        }
      );
    },
    [updateProduct]
  );

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-page__header">
        <div>
          <h1 className="inventory-page__title">Gestión de Inventario</h1>
          <p className="inventory-page__subtitle">
            {isLoading ? 'Cargando…' : `${total} productos registrados`}
          </p>
        </div>

        <div className="inventory-page__legend">
          <span className="inv-legend inv-legend--normal">Normal</span>
          <span className="inv-legend inv-legend--warning">Alerta</span>
          <span className="inv-legend inv-legend--danger">Agotado</span>
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="inventory-toast inventory-toast--success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="inventory-toast inventory-toast--error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          Error al cargar el inventario. Comprueba la conexión con el backend.
        </div>
      )}

      {/* Table */}
      <InventoryTable data={products} onEdit={handleEdit} loading={isLoading} />

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
};
