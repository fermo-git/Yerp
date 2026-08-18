import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import {
  addFavorite,
  getMyFavorites,
  removeFavorite,
} from "@/services/api/favorites";
import type { Business } from "@/types/business";

const FAVORITES_KEY = ["favorites", "mine"] as const;

export function useFavorites() {
  const { status } = useAuth();
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: getMyFavorites,
    enabled: status === "authenticated",
  });
}

interface ToggleFavoriteInput {
  business: Business;
  favorite: boolean;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ business, favorite }: ToggleFavoriteInput) => {
      if (favorite) await addFavorite(business.id);
      else await removeFavorite(business.id);
    },
    onMutate: async ({ business, favorite }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEY });
      const previous = queryClient.getQueryData<Business[]>(FAVORITES_KEY);
      queryClient.setQueryData<Business[]>(FAVORITES_KEY, (old = []) =>
        favorite
          ? [business, ...old.filter((b) => b.id !== business.id)]
          : old.filter((b) => b.id !== business.id)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITES_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
  });
}
