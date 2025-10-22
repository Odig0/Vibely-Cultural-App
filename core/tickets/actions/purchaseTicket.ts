import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config';
import { PurchaseTicketRequest, PurchaseTicketResponse } from '../interfaces/ticket.interface';

/**
 * Comprar tickets para un evento
 * Endpoint: POST {{base_url}}/tickets/purchase
 */
export const purchaseTicket = async (
  data: PurchaseTicketRequest,
  token: string
): Promise<PurchaseTicketResponse> => {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.TICKETS_PURCHASE), {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al comprar el ticket');
  }

  const ticket = await response.json();
  return ticket;
};
