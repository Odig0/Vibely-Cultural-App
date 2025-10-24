import { API_CONFIG, buildApiUrl, getAuthHeaders } from '@/config';
import { LoginResponse, LoginUserDto, RegisterUserDto, User } from '@/core/auth/interface/useAuthStore';

/**
 * Servicio de autenticación para comunicarse con el backend
 */
export class AuthService {
  
  /**
   * Iniciar sesión
   */
  static async login(credentials: LoginUserDto): Promise<LoginResponse> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el login');
      }


      return data as LoginResponse;
    } catch (error) {
      console.error('💥 Error en login:', error);
      throw error instanceof Error ? error : new Error('Error desconocido en login');
    }
  }

  /**
   * Registrar nuevo usuario (solo crea el usuario, no devuelve token)
   */
  static async register(userData: RegisterUserDto): Promise<User> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });



      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Respuesta no OK:', data);
        throw new Error(data.message || 'Error en el registro');
      }

      return data as User;
    } catch (error) {
      console.error('💥 Error en registro AuthService:', error);
      throw error instanceof Error ? error : new Error('Error desconocido en registro');
    }
  }

  /**
   * Solicitar reset de contraseña
   */
  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    const url = buildApiUrl(API_CONFIG.ENDPOINTS.REQUEST_PASSWORD_RESET);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al solicitar reset de contraseña');
      }

      return data;
    } catch (error) {
      console.error('💥 Error en reset password:', error);
      throw error instanceof Error ? error : new Error('Error desconocido en reset de contraseña');
    }
  }

  /**
   * Validar token (para verificar si el usuario sigue autenticado)
   */
  static async validateToken(token: string): Promise<User> {
    // Este endpoint lo puedes implementar en tu backend si lo necesitas
    const url = buildApiUrl('/auth/validate');
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      const data = await response.json();
      return data.user as User;
    } catch (error) {
      console.error('Error validando token:', error);
      throw error instanceof Error ? error : new Error('Error validando token');
    }
  }
}