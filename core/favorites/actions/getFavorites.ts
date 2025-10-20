import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config';
import { Event } from '@/core/events/interfaces/event.interface';
import { FavoriteResponse } from '@/core/favorites/interfaces/favorite.interface';

export const getFavorites = async (token: string): Promise<Event[]> => {
  const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FAVORITES), {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error('Error al obtener favoritos');
  }

  const data: FavoriteResponse[] = await response.json();
  
  // Mapear la respuesta al formato Event
  return data.map((favorite) => ({
    id: favorite.event_id,
    title: favorite.event.title,
    description: favorite.event.description,
    starts_at: favorite.event.starts_at,
    ends_at: favorite.event.ends_at,
    cover_image_url: favorite.event.cover_url,
    cover_url: favorite.event.cover_url,
    event_location_name: favorite.event.event_location_name || favorite.event.city,
    event_location_address: favorite.event.event_location_address || '',
    event_location_url: favorite.event.event_location_url || '',
    capacity: favorite.event.capacity || 0,
    tickets_sold: favorite.event.tickets_sold || 0,
    base_ticket_price: favorite.event.base_ticket_price,
    is_free: favorite.event.is_free,
    is_single_price: favorite.event.is_single_price,
    city: favorite.event.city,
    event_name: favorite.event.event_name,
    created_at: favorite.created_at,
    organizer_id: favorite.user_id,
    points_revenue: 0,
    categories: [],
  }));
};
