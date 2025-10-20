import { API_CONFIG, getApiEndpoint } from '@/config';
import { Event } from '../interfaces/event.interface';

export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await fetch(getApiEndpoint(API_CONFIG.ENDPOINTS.EVENT_BY_ID, id));
    
    if (!response.ok) {
      throw new Error('Error al obtener el evento');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};
