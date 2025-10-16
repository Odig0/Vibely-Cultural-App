import CustomTabBar from '@/presentation/theme/components/CustomTabBar';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { Stack } from 'expo-router';
import { useState } from 'react';

export default function EventsAppLayout() {
  const [activeTab, setActiveTab] = useState('home');

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
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="(home)" 
          options={{ 
            headerShown: false
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