export interface FavoriteResponse {
  user_id: string;
  event_id: string;
  created_at: string;
  event: {
    id?: string;
    title: string;
    description: string;
    starts_at: string;
    ends_at: string;
    event_name: string;
    city: string;
    cover_url: string;
    is_free: boolean;
    base_ticket_price: number;
    is_single_price: boolean;
    event_location_name?: string;
    event_location_address?: string;
    event_location_url?: string;
    capacity?: number;
    tickets_sold?: number;
  };
}
