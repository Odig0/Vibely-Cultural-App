import { getEvents } from '@/core/events/actions/getEvents';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { useQuery } from '@tanstack/react-query';

export const useEvents = () => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(token),
    enabled: !!token, // Solo ejecutar si el usuario está autenticado
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos (anteriormente cacheTime)
  });
};