import { API_CONFIG } from './api';

/**
 * Helper para construir URLs completas usando la base URL del ambiente actual
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

/**
 * Helper para obtener la URL completa de un endpoint
 * Soporta tanto strings como funciones que retornan strings
 */
export const getApiEndpoint = (
  endpoint: string | ((param: string) => string),
  param?: string
): string => {
  const path = typeof endpoint === 'function' && param
    ? endpoint(param)
    : typeof endpoint === 'string'
    ? endpoint
    : '';
  
  return buildApiUrl(path);
};
