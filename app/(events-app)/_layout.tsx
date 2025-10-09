import LogoutIconButton from '@/presentation/auth/components/LogoutIconButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function EventsAppLayout() {
  const { user } = useAuthStore();
  const iconColor = useThemeColor({ light: '#FF8C00', dark: '#FFB347' }, 'text');

  const HeaderTitle = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons 
        name="ticket-outline" 
        size={24} 
        color={iconColor} 
        style={{ marginRight: 8 }} 
      />
      <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>
        Bienvenido, {user?.user_name || 'Usuario'}!
      </ThemedText>
    </View>
  );

  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="(home)" 
        options={{ 
          headerTitle: () => <HeaderTitle />,
          headerLeft: () => <LogoutIconButton />
        }} 
      />
    </Stack>
  );
} 