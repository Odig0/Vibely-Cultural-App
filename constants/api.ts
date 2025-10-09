/**
 * Configuración de la API
 */
export const API_CONFIG = {
  BASE_URL: 'https://app-cultural-606100971917.southamerica-east1.run.app', // Para emulador Android
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REQUEST_PASSWORD_RESET: '/auth/password-reset',
    
    // Future endpoints can be added here
    // EVENTS: '/events',
    // PROFILE: '/profile',
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Helper para construir URLs completas
 */
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Helper para obtener headers con token de autorización
 */
export const getAuthHeaders = (token?: string): Record<string, string> => {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};