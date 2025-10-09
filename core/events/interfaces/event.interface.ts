export interface EventCategory {
  id: number;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  city: string;
  event_name: string;
  starts_at: string;
  ends_at: string;
  is_free: boolean;
  capacity: number;
  cover_url: string;
  cover_image_url: string;
  event_location_name: string;
  event_location_url: string;
  event_location_address: string;
  base_ticket_price: number;
  is_single_price: boolean;
  created_at: string;
  description: string;
  organizer_id: string;
  tickets_sold: number;
  points_revenue: number;
  categories: EventCategory[];
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}