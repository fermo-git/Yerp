import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min: los datos de negocios no cambian a cada segundo
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
