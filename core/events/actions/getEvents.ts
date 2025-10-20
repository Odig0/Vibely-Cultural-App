import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config';
import { Event } from '@/core/events/interfaces/event.interface';

/**
 * Obtener todos los eventos
 */
export const getEvents = async (token?: string): Promise<Event[]> => {
  const url = buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS);
  console.log('🌐 getEvents - URL:', url);
  
  try {
    console.log('🚀 Enviando petición para obtener eventos...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    console.log('📡 Events - Status:', response.status, 'OK:', response.ok);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.log('❌ Error obteniendo eventos:', errorData);
      throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('📄 Events - Respuesta:', `${data.length} eventos recibidos`);
    console.log('📄 Primer evento:', data[0]);

    return data as Event[];
  } catch (error) {
    console.error('💥 Error en getEvents:', error);
    throw error instanceof Error ? error : new Error('Error desconocido obteniendo eventos');
  }
};