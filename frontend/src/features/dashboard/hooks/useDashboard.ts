import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axiosInstance';

export interface DashboardStats {
  ventas_del_mes: number;
  ordenes_pendientes: number;
  productos_en_alerta: number;
  valor_total_inventario: number;
}

export interface TopProduct {
  product_id: number;
  nombre: string;
  total_vendido: number;
}

export interface CategoryDistribution {
  categoria: string;
  total: number;
}

export interface LowStockProduct {
  id: number;
  sku: string;
  nombre: string;
  categoria: string;
  stock_actual: number;
  stock_minimo: number;
  precio: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axiosInstance.get('/dashboard/stats');
  return data;
};

const fetchTopProducts = async (): Promise<TopProduct[]> => {
  const { data } = await axiosInstance.get('/dashboard/top-products');
  return data;
};

const fetchCategoryDistribution = async (): Promise<CategoryDistribution[]> => {
  const { data } = await axiosInstance.get('/dashboard/category-distribution');
  return data;
};

const fetchLowStockAlerts = async (): Promise<LowStockProduct[]> => {
  const { data } = await axiosInstance.get('/products/alerts');
  return data;
};

export const useDashboard = () => {
  const statsQuery = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: 1,
  });

  const topProductsQuery = useQuery<TopProduct[]>({
    queryKey: ['dashboard', 'top-products'],
    queryFn: fetchTopProducts,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const categoryQuery = useQuery<CategoryDistribution[]>({
    queryKey: ['dashboard', 'category-distribution'],
    queryFn: fetchCategoryDistribution,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const alertsQuery = useQuery<LowStockProduct[]>({
    queryKey: ['products', 'alerts'],
    queryFn: fetchLowStockAlerts,
    staleTime: 1000 * 60,
    retry: 1,
  });

  return {
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,

    topProducts: topProductsQuery.data ?? [],
    isLoadingTopProducts: topProductsQuery.isLoading,

    categoryDistribution: categoryQuery.data ?? [],
    isLoadingCategory: categoryQuery.isLoading,

    lowStockAlerts: alertsQuery.data ?? [],
    isLoadingAlerts: alertsQuery.isLoading,

    refetchAll: () => {
      statsQuery.refetch();
      topProductsQuery.refetch();
      categoryQuery.refetch();
      alertsQuery.refetch();
    },
  };
};
