import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import type { Product } from '../../../../types';
import './InventoryTable.css';

interface InventoryTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  loading?: boolean;
}

const columnHelper = createColumnHelper<Product>();

const StockStatusCell: React.FC<{ actual: number; minimo: number }> = ({ actual, minimo }) => {
  if (actual === 0) return <span className="inv-badge inv-badge--danger">Agotado</span>;
  if (actual <= minimo) return <span className="inv-badge inv-badge--warning">Alerta</span>;
  return <span className="inv-badge inv-badge--success">Normal</span>;
};

const SortIcon: React.FC<{ direction: false | 'asc' | 'desc' }> = ({ direction }) => {
  if (!direction)
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35">
        <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
      </svg>
    );
  if (direction === 'asc')
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M7 14l5-5 5 5" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M7 10l5 5 5-5" />
    </svg>
  );
};

export const InventoryTable: React.FC<InventoryTableProps> = ({ data, onEdit, loading }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: (info) => <code className="inv-sku">{info.getValue()}</code>,
        size: 110,
      }),
      columnHelper.accessor('nombre', {
        header: 'Producto',
        cell: (info) => (
          <div className="inv-product-name">
            <span className="inv-name">{info.getValue()}</span>
          </div>
        ),
        size: 220,
      }),
      columnHelper.accessor('categoria', {
        header: 'Categoría',
        cell: (info) => <span className="inv-categoria">{info.getValue()}</span>,
        size: 140,
      }),
      columnHelper.accessor('precio', {
        header: 'Precio',
        cell: (info) =>
          new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }).format(info.getValue()),
        size: 120,
      }),
      columnHelper.accessor('stock_actual', {
        header: 'Stock Actual',
        cell: (info) => {
          const val = info.getValue();
          const minimo = info.row.original.stock_minimo;
          const cls =
            val === 0
              ? 'inv-stock inv-stock--zero'
              : val <= minimo
              ? 'inv-stock inv-stock--low'
              : 'inv-stock';
          return <span className={cls}>{val}</span>;
        },
        size: 120,
      }),
      columnHelper.accessor('stock_minimo', {
        header: 'Stock Mín.',
        cell: (info) => <span className="inv-stock-min">{info.getValue()}</span>,
        size: 110,
      }),
      columnHelper.display({
        id: 'status',
        header: 'Estado',
        cell: (info) => (
          <StockStatusCell
            actual={info.row.original.stock_actual}
            minimo={info.row.original.stock_minimo}
          />
        ),
        size: 100,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => (
          <button
            className="inv-edit-btn"
            onClick={() => onEdit(info.row.original)}
            title="Editar stock y precio"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>
        ),
        size: 90,
      }),
    ],
    [onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="inv-table-card">
        <div className="inv-skeleton-rows">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="inv-skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inv-table-card">
      {/* Search */}
      <div className="inv-toolbar">
        <div className="inv-search-wrapper">
          <svg className="inv-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="inv-search"
            placeholder="Buscar por nombre, SKU o categoría…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <span className="inv-count">{table.getFilteredRowModel().rows.length} productos</span>
      </div>

      {/* Table */}
      <div className="inv-table-wrapper">
        <table className="inv-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'inv-th--sortable' : ''}
                  >
                    <div className="inv-th-inner">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <SortIcon direction={header.column.getIsSorted()} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="inv-empty">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="inv-row">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
