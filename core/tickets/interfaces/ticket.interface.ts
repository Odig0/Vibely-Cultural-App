export interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  qr_code: string;
  status: 'active' | 'used' | 'cancelled' | 'pending';
  purchased_at: string;
  used_at: string | null;
  created_at: string;
  ticket_type: string;
  price: string;
  paid_with_points: boolean;
  points_used: number;
  event_price_id: string | null;
  event_name: string | null;
  date_event: string | null;
  event_location_name: string | null;
  event_location_url: string | null;
  quantity?: number;
  event?: {
    id: string;
    title: string;
    date: string;
    location: string;
    image_url: string;
    price: number;
  };
}

export interface PurchaseTicketRequest {
  event_id: string;
  quantity: number;
}

export interface PurchaseTicketResponse extends Ticket {}
