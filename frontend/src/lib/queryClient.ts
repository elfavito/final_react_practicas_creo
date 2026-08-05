import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de tiempo fresco por defecto
      gcTime: 1000 * 60 * 15, // 15 minutos en caché
      refetchOnWindowFocus: false, // Evita peticiones innecesarias al cambiar de pestaña
      retry: 1, // Intentar 1 vez adicional en caso de fallo
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
