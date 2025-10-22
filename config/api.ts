import { getBaseUrl } from './environment';

/**
 * Configuración de URLs de la API
 */
export const API_CONFIG = {
  /**
   * URL base del API (se obtiene dinámicamente según el ambiente)
   */
  get BASE_URL() {
    return getBaseUrl();
  },
  
  /**
   * Endpoints de la API
   */
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REQUEST_PASSWORD_RESET: '/auth/password-reset',
    
    // Events endpoints
    EVENTS: '/events',
    EVENT_BY_ID: (id: string) => `/events/${id}`,
    
    // Favorites endpoints
    FAVORITES: '/favorites',
    FAVORITES_SAVE: '/favorites/save',
    FAVORITES_UNSAVE: (eventId: string) => `/favorites/unsave/${eventId}`,
    
    // Tickets endpoints
    TICKETS_PURCHASE: '/tickets/purchase',
    TICKETS_MY_TICKETS: '/tickets/my-tickets',
    
    // Profile endpoint (future)
    // PROFILE: '/profile',
  },
  
  /**
   * Headers por defecto
   */
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;