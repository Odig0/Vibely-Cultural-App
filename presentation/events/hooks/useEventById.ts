import { getEventById } from '@/core/events/actions/getEventById';
import { useQuery } from '@tanstack/react-query';

export const useEventById = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
};
