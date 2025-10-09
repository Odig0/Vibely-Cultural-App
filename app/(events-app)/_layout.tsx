import LogoutIconButton from '@/presentation/auth/components/LogoutIconButton';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import CustomTabBar from '@/presentation/theme/components/CustomTabBar';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

export default function EventsAppLayout() {
  const { user } = useAuthStore();
  const iconColor = useThemeColor({ light: '#FF8C00', dark: '#FFB347' }, 'text');
  const [activeTab, setActiveTab] = useState('home');

  const HeaderTitle = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons 
        name="ticket-outline" 
        size={24} 
        color={iconColor} 
        style={{ marginRight: 8 }} 
      />
      <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>
        Hola, {user?.user_name || 'Usuario'}!
      </ThemedText>
    </View>
  );

  const handleTabPress = (tabId: string) => {
    if (tabId === 'home') {
      setActiveTab(tabId);
      // Solo el home funciona por ahora
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
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
      
      <CustomTabBar 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </ThemedView>
  );
} 