import React from 'react';
import './KpiCard.css';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accentColor?: 'primary' | 'success' | 'warning' | 'danger';
  loading?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  accentColor = 'primary',
  loading = false,
}) => {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendClass =
    trend === 'up' ? 'kpi-card__trend--up' : trend === 'down' ? 'kpi-card__trend--down' : 'kpi-card__trend--neutral';

  if (loading) {
    return (
      <div className="kpi-card kpi-card--loading">
        <div className="kpi-card__skeleton-icon" />
        <div className="kpi-card__skeleton-text" />
        <div className="kpi-card__skeleton-value" />
      </div>
    );
  }

  return (
    <div className={`kpi-card kpi-card--${accentColor}`}>
      <div className="kpi-card__header">
        <span className="kpi-card__title">{title}</span>
        <div className={`kpi-card__icon-wrapper kpi-card__icon-wrapper--${accentColor}`}>
          {icon}
        </div>
      </div>
      <div className="kpi-card__value">{value}</div>
      {subtitle && <p className="kpi-card__subtitle">{subtitle}</p>}
      {trendValue && (
        <div className={`kpi-card__trend ${trendClass}`}>
          <span className="kpi-card__trend-icon">{trendIcon}</span>
          <span>{trendValue}</span>
        </div>
      )}
      <div className={`kpi-card__accent-bar kpi-card__accent-bar--${accentColor}`} />
    </div>
  );
};
