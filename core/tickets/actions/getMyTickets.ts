import { API_CONFIG } from '@/config/api';
import { buildApiUrl, getAuthHeaders } from '@/config/api.helpers';
import { Ticket } from '../interfaces/ticket.interface';

export const getMyTickets = async (token: string): Promise<Ticket[]> => {
  try {
    const response = await fetch(
      buildApiUrl(API_CONFIG.ENDPOINTS.TICKETS_MY_TICKETS),
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las entradas');
    }

    return data;
  } catch (error) {
    console.error('Error en getMyTickets:', error);
    throw error;
  }
};
