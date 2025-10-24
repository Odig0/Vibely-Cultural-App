import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { useAuthStore } from '../store/useAuthStrore';

const LogoutIconButton = () => {
  const primaryColor = useThemeColor({}, 'primary');
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <Pressable 
      style={{ marginRight: 8 }} 
      onPress={handleLogout}
    >
      <Ionicons name="log-out-outline" size={24} color={primaryColor} />
    </Pressable>
  );
};

export default LogoutIconButton;