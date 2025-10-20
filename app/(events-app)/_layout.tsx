import CustomTabBar from '@/presentation/theme/components/CustomTabBar';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';

export default function EventsAppLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      router.push('/(events-app)/(home)' as any);
    } else if (tabId === 'favorites') {
      router.push('/(events-app)/favorites' as any);
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
        <Stack.Screen 
          name="favorites/index" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'card'
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