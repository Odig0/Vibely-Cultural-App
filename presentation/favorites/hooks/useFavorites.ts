import { Event } from '@/core/events/interfaces/event.interface';
import { getFavorites } from '@/core/favorites/actions/getFavorites';
import { saveFavorite } from '@/core/favorites/actions/saveFavorite';
import { unsaveFavorite } from '@/core/favorites/actions/unsaveFavorite';
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

  // Mutation para guardar favorito con optimistic update
  const saveMutation = useMutation({
    mutationFn: ({ eventId, eventData }: { eventId: string; eventData?: Event }) => 
      saveFavorite(eventId, token!),
    
    // Optimistic update: actualiza la UI inmediatamente
    onMutate: async ({ eventId, eventData }) => {
      // Cancela queries en progreso para evitar sobrescribir nuestro update optimista
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      
      // Guarda el estado anterior por si necesitamos hacer rollback
      const previousFavorites = queryClient.getQueryData<Event[]>(['favorites']);
      
      // Actualiza optimistamente el cache
      if (eventData) {
        queryClient.setQueryData<Event[]>(['favorites'], (old = []) => [...old, eventData]);
      }
      
      return { previousFavorites };
    },
    
    // Si la mutación falla, revierte al estado anterior
    onError: (err, variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
      console.error('Error al guardar favorito:', err);
    },
    
    // Siempre refetch después de error o éxito para mantener sincronizado
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Mutation para remover favorito (unsave) con optimistic update
  const unsaveMutation = useMutation({
    mutationFn: (eventId: string) => unsaveFavorite(eventId, token!),
    
    // Optimistic update: remueve inmediatamente de la UI
    onMutate: async (eventId) => {
      // Cancela queries en progreso
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      
      // Guarda el estado anterior
      const previousFavorites = queryClient.getQueryData<Event[]>(['favorites']);
      
      // Remueve optimistamente del cache
      queryClient.setQueryData<Event[]>(['favorites'], (old = []) => 
        old.filter((fav) => fav.id !== eventId)
      );
      
      return { previousFavorites };
    },
    
    // Si falla, revierte al estado anterior
    onError: (err, eventId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites'], context.previousFavorites);
      }
      console.error('Error al quitar favorito:', err);
    },
    
    // Refetch para mantener sincronizado
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const toggleFavorite = (eventId: string, eventData?: Event) => {
    const isFavorite = favorites.some((fav) => fav.id === eventId);
    if (isFavorite) {
      unsaveMutation.mutate(eventId);
    } else {
      saveMutation.mutate({ eventId, eventData });
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
    isSaving: saveMutation.isPending || unsaveMutation.isPending,
  };
};

