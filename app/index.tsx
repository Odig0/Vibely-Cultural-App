import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { Redirect } from 'expo-router';

export default function Index() {
  const { status } = useAuthStore();

  // console.log('Index component - Auth status:', status);

  // Si está autenticado, ir a la app principal
  if (status === 'authenticated') {
    // console.log('Redireccion a eventos app');
    return <Redirect href="/(events-app)/(home)" />;
  }

  // Si no está autenticado o está verificando, ir al login
  // console.log('Redireccion a login');
  return <Redirect href="/auth/login" />;
}