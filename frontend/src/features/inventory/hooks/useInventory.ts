import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../../lib/axiosInstance';
import type { Product, ProductUpdate } from '../../../types';

export interface InventoryFilters {
  page?: number;
  size?: number;
  categoria?: string;
  search?: string;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  size: number;
}

const fetchInventory = async (filters: InventoryFilters = {}): Promise<PaginatedProducts> => {
  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    size: filters.size ?? 20,
  };
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.search) params.search = filters.search;

  const { data } = await axiosInstance.get('/products', { params });

  // Handle both paginated and array responses
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: 1, size: data.length };
  }
  return data;
};

const patchProduct = async ({
  id,
  updates,
}: {
  id: number;
  updates: ProductUpdate;
}): Promise<Product> => {
  const { data } = await axiosInstance.patch(`/products/${id}`, updates);
  return data;
};

export const useInventory = (filters: InventoryFilters = {}) => {
  const queryClient = useQueryClient();

  const queryKey = ['inventory', filters] as const;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PaginatedProducts>({
    queryKey,
    queryFn: () => fetchInventory(filters),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

  const updateMutation = useMutation({
    mutationFn: patchProduct,
    onSuccess: (updatedProduct) => {
      // Optimistic-style: update query cache directly
      queryClient.setQueryData<PaginatedProducts>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
        };
      });
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'alerts'] });
    },
  });

  return {
    products: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error,
    refetch,

    updateProduct: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    isUpdateSuccess: updateMutation.isSuccess,
    resetUpdate: updateMutation.reset,
  };
};
