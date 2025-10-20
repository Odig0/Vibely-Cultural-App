import { API_CONFIG, getApiEndpoint, getAuthHeaders } from '@/config';

export const removeFavorite = async (eventId: string, token: string): Promise<void> => {
  const response = await fetch(getApiEndpoint(API_CONFIG.ENDPOINTS.FAVORITES_REMOVE, eventId), {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      event_id: eventId,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al quitar el favorito');
  }
};
