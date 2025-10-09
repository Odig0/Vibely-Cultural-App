import { Event } from '@/core/events/interfaces/event.interface';

const API_URL = 'https://app-cultural-606100971917.southamerica-east1.run.app';

/**
 * Obtener todos los eventos
 */
export const getEvents = async (token?: string): Promise<Event[]> => {
  const url = `${API_URL}/events`;
  console.log('🌐 getEvents - URL:', url);
  
  try {
    console.log('🚀 Enviando petición para obtener eventos...');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Si hay token, agregarlo a los headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
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