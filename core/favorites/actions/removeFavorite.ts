import { API_CONFIG, getApiEndpoint, getAuthHeaders } from '@/config';

export const removeFavorite = async (eventId: string, token: string): Promise<void> => {
  const response = await fetch(getApiEndpoint(API_CONFIG.ENDPOINTS.FAVORITES_UNSAVE, eventId), {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Error al quitar el favorito');
  }
};
