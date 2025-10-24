import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config';
import { Event } from '@/core/events/interfaces/event.interface';

/**
 * Obtener todos los eventos
 */
export const getEvents = async (token?: string): Promise<Event[]> => {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS);
  
  try {
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    return data as Event[];
  } catch (error) {
    console.error('💥 Error en getEvents:', error);
    throw error instanceof Error ? error : new Error('Error desconocido obteniendo eventos');
  }
};