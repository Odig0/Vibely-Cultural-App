import { getMyTickets } from '@/core/tickets/actions/getMyTickets';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { useQuery } from '@tanstack/react-query';

export const useMyTickets = () => {
  const token = useAuthStore((state) => state.token);

  const query = useQuery({
    queryKey: ['tickets', 'my-tickets'],
    queryFn: () => getMyTickets(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    tickets: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
