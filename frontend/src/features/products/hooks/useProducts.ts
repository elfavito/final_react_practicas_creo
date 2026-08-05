import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../lib/axiosInstance';
import { Product, PaginatedResponse } from '../../../../types';

export interface UseProductsFilters {
  skip?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  min_precio?: number;
  max_precio?: number;
  min_rating?: number;
}

export const fetchProducts = async (filters: UseProductsFilters): Promise<PaginatedResponse<Product>> => {
  // Construimos los query parameters dinámicamente
  const params = new URLSearchParams();
  
  if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.categoria) params.append('categoria', filters.categoria);
  if (filters.min_precio !== undefined) params.append('min_precio', filters.min_precio.toString());
  if (filters.max_precio !== undefined) params.append('max_precio', filters.max_precio.toString());
  if (filters.min_rating !== undefined) params.append('min_rating', filters.min_rating.toString());

  const response = await axiosInstance.get(`/products?${params.toString()}`);
  
  // If the backend returns a direct list, we'll wrap it to simulate pagination, 
  // or return response.data if it matches PaginatedResponse
  return response.data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const useProducts = (filters: UseProductsFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};
