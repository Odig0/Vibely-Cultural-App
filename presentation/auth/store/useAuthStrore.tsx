import { LoginUserDto, RegisterUserDto, User } from "@/core/auth/interface/useAuthStore";
import { AuthService } from "@/core/auth/services/AuthService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from "zustand";

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'checking';


export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, userName: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      set({ status: 'loading' });

      const loginData: LoginUserDto = {
        user_email: email,
        password: password,
      };

      const response = await AuthService.login(loginData);
      
      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('auth_token', response.access_token);
      
      // Actualizar estado
      set({
        status: 'authenticated',
        token: response.access_token,
        user: response.user,
      });

      return true;
    } catch (error) {
      console.error('Error en login:', error);
      set({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      });
      return false;
    }
  },

  register: async (email: string, userName: string, password: string): Promise<boolean> => {
    try {
      set({ status: 'loading' });

      const registerData: RegisterUserDto = {
        user_email: email,
        user_name: userName,
        password: password,
      };

      const registerResponse = await AuthService.register(registerData);
      
      // Después del registro exitoso, mantener estado unauthenticated
      // para que el usuario haga login manualmente
      set({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      });

      return true;
    } catch (error) {
      console.error('💥 Error en registro store:', error);
      set({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      });
      return false;
    }
  },
  
  checkStatus: async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        set({ status: 'unauthenticated' });
        return;
      }

      // Aquí podrías validar el token con el backend
      // const user = await AuthService.validateToken(token);
      
      // Por ahora, si existe el token, asumimos que es válido
      set({
        status: 'authenticated',
        token: token,
        // user: user, // Uncomment when validateToken is implemented
      });
    } catch (error) {
      console.error('Error verificando estado:', error);
      set({ status: 'unauthenticated' });
    }
  },

  logout: (): void => {
    
    try {
      // Limpiar AsyncStorage
      AsyncStorage.removeItem('auth_token');
      
      // Limpiar estado
      set({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      });
      
    } catch (error) {
      console.error('💥 Error durante logout:', error);
      // Aún así limpiar el estado
      set({
        status: 'unauthenticated',
        token: undefined,
        user: undefined,
      });
    }
  }
}))