import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TopProduct } from '../../hooks/useDashboard';
import './SalesBarChart.css';

interface SalesBarChartProps {
  data: TopProduct[];
  loading?: boolean;
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="sales-chart__tooltip">
        <p className="sales-chart__tooltip-label">{label}</p>
        <p className="sales-chart__tooltip-value">
          <span>{payload[0].value}</span> unidades
        </p>
      </div>
    );
  }
  return null;
};

export const SalesBarChart: React.FC<SalesBarChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="chart-card">
        <div className="chart-card__header">
          <div className="chart-card__title-skeleton" />
        </div>
        <div className="chart-card__body--loading" />
      </div>
    );
  }

  const chartData = data.slice(0, 5).map((p) => ({
    name: p.nombre.length > 14 ? p.nombre.substring(0, 14) + '…' : p.nombre,
    fullName: p.nombre,
    vendido: p.total_vendido,
  }));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">🏆 Top 5 Productos Más Vendidos</h3>
        <span className="chart-card__badge">Unidades</span>
      </div>
      <div className="chart-card__body">
        {chartData.length === 0 ? (
          <div className="chart-card__empty">No hay datos de ventas aún</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="vendido" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
