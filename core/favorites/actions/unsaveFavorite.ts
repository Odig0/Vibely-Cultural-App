import { API_CONFIG, getApiEndpoint, getAuthHeaders } from '@/config';

/**
 * Quitar un evento de favoritos (unsave)
 * Endpoint: DELETE {{base_url}}/favorites/unsave/{{event_id}}
 */
export const unsaveFavorite = async (eventId: string, token: string): Promise<void> => {
  const response = await fetch(getApiEndpoint(API_CONFIG.ENDPOINTS.FAVORITES_UNSAVE, eventId), {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al quitar el favorito');
  }
};
