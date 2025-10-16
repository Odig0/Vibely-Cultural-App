import { API_CONFIG } from '@/constants/api';
import { Event } from '../interfaces/event.interface';

export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/events/${id}`);
    
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
