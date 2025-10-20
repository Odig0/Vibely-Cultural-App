import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config';

export const saveFavorite = async (eventId: string, token: string): Promise<void> => {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FAVORITES_SAVE), {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      event_id: eventId,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al guardar el favorito');
  }
};
