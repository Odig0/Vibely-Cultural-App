import { getFavorites } from '@/core/favorites/actions/getFavorites';
import { removeFavorite } from '@/core/favorites/actions/removeFavorite';
import { saveFavorite } from '@/core/favorites/actions/saveFavorite';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFavorites = () => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading, error, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(token!),
    enabled: !!token,
  });

  const saveMutation = useMutation({
    mutationFn: (eventId: string) => saveFavorite(eventId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (eventId: string) => removeFavorite(eventId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const toggleFavorite = (eventId: string) => {
    const isFavorite = favorites.some((fav) => fav.id === eventId);
    if (isFavorite) {
      removeMutation.mutate(eventId);
    } else {
      saveMutation.mutate(eventId);
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.some((fav) => fav.id === eventId);
  };

  return {
    favorites,
    isLoading,
    error,
    refetch,
    toggleFavorite,
    isFavorite,
    isSaving: saveMutation.isPending || removeMutation.isPending,
  };
};
