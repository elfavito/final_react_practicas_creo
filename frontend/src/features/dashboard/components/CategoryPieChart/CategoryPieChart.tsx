import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CategoryDistribution } from '../../hooks/useDashboard';
import './CategoryPieChart.css';

interface CategoryPieChartProps {
  data: CategoryDistribution[];
  loading?: boolean;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total;
    return (
      <div className="sales-chart__tooltip">
        <p className="sales-chart__tooltip-label">{payload[0].name}</p>
        <p className="sales-chart__tooltip-value">
          <span>{total}</span> productos
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, loading }) => {
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

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3 className="chart-card__title">📊 Distribución por Categoría</h3>
        <span className="chart-card__badge">Inventario</span>
      </div>
      <div className="chart-card__body">
        {data.length === 0 ? (
          <div className="chart-card__empty">No hay categorías disponibles</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
