import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { KpiCard } from '../../components/KpiCard/KpiCard';
import { SalesBarChart } from '../../components/SalesBarChart/SalesBarChart';
import { CategoryPieChart } from '../../components/CategoryPieChart/CategoryPieChart';
import { LowStockAlertTable } from '../../components/LowStockAlertTable/LowStockAlertTable';
import './DashboardPage.css';

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const formatNumber = (val: number) => new Intl.NumberFormat('es-AR').format(val);

// SVG Icons
const SalesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const OrdersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InventoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export const DashboardPage: React.FC = () => {
  const {
    stats,
    isLoadingStats,
    topProducts,
    isLoadingTopProducts,
    categoryDistribution,
    isLoadingCategory,
    lowStockAlerts,
    isLoadingAlerts,
    refetchAll,
  } = useDashboard();

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-page__header">
        <div>
          <h1 className="dashboard-page__title">Panel de Administración</h1>
          <p className="dashboard-page__subtitle">Resumen operacional en tiempo real</p>
        </div>
        <button className="dashboard-page__refresh-btn" onClick={refetchAll} title="Actualizar datos">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* KPI Grid */}
      <div className="dashboard-page__kpi-grid">
        <KpiCard
          title="Ventas del Mes"
          value={stats ? formatCurrency(stats.ventas_del_mes) : '—'}
          subtitle="Total facturado este mes"
          icon={<SalesIcon />}
          accentColor="primary"
          loading={isLoadingStats}
          trend="up"
          trendValue="vs mes anterior"
        />
        <KpiCard
          title="Órdenes Pendientes"
          value={stats ? formatNumber(stats.ordenes_pendientes) : '—'}
          subtitle="Requieren atención"
          icon={<OrdersIcon />}
          accentColor="warning"
          loading={isLoadingStats}
        />
        <KpiCard
          title="Productos en Alerta"
          value={stats ? formatNumber(stats.productos_en_alerta) : '—'}
          subtitle="Stock por debajo del mínimo"
          icon={<AlertIcon />}
          accentColor="danger"
          loading={isLoadingStats}
        />
        <KpiCard
          title="Valor del Inventario"
          value={stats ? formatCurrency(stats.valor_total_inventario) : '—'}
          subtitle="Valorización total en stock"
          icon={<InventoryIcon />}
          accentColor="success"
          loading={isLoadingStats}
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard-page__charts-row">
        <SalesBarChart data={topProducts} loading={isLoadingTopProducts} />
        <CategoryPieChart data={categoryDistribution} loading={isLoadingCategory} />
      </div>

      {/* Alerts Table */}
      <LowStockAlertTable data={lowStockAlerts} loading={isLoadingAlerts} />
    </div>
  );
};
