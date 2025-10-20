import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

interface TabItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface Props {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const CustomTabBar = ({ activeTab, onTabPress }: Props) => {
  const tabBarBg = useThemeColor({ light: '#FFFFFF', dark: '#000000' }, 'background');
  const activeColor = useThemeColor({ light: '#FF8C00', dark: '#FF8C00' }, 'text');
  const inactiveColor = useThemeColor({ light: '#8E8E93', dark: '#666666' }, 'text');

  const tabs: TabItem[] = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'calendar', icon: 'calendar', label: 'Calendario' },
    { id: 'ticket', icon: 'ticket', label: 'Tickets' },
    { id: 'favorites', icon: 'heart', label: 'Favoritos' },
  ];

  return (
    <ThemedView
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: Platform.OS === 'android' ? 40 : 50,
        paddingHorizontal: 10,
        borderTopWidth: 0.5,
        borderTopColor: useThemeColor({ light: '#E5E5E7', dark: '#1A1A1A' }, 'text'),
      }}
      lightColor={tabBarBg}
      darkColor={tabBarBg}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconColor = isActive ? activeColor : inactiveColor;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              paddingVertical: 5,
            }}
            disabled={tab.id !== 'home' && tab.id !== 'favorites'} // Home y Favoritos funcionan
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={iconColor}
              style={{
                opacity: (tab.id !== 'home' && tab.id !== 'favorites' && !isActive) ? 0.6 : 1,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
};

export default CustomTabBar;