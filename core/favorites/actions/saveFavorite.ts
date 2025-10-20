import { API_CONFIG } from '@/constants/api';

export const saveFavorite = async (eventId: string, token: string): Promise<void> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}/favorites/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      event_id: eventId,
    }),
  });

  if (!response.ok) {
    throw new Error('Error al guardar el favorito');
  }
};
