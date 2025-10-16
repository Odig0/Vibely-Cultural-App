import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';

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
  const tabBarBg = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  const activeColor = useThemeColor({ light: '#FF8C00', dark: '#FFB347' }, 'text');
  const inactiveColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'text');

  const tabs: TabItem[] = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'calendar', icon: 'calendar', label: 'Calendario' },
    { id: 'ticket', icon: 'ticket', label: 'Tickets' },
    { id: 'favorites', icon: 'heart', label: 'Favoritos' },
    { id: 'profile', icon: 'person', label: 'Perfil' },
  ];

  return (
    <ThemedView
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: Platform.OS === 'android' ? 15 : 20,
        paddingHorizontal: 10,
        borderTopWidth: 0.5,
        borderTopColor: useThemeColor({ light: '#E5E5E7', dark: '#38383A' }, 'text'),
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
            disabled={tab.id !== 'home'} // Solo el home funciona por ahora
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={iconColor}
              style={{
                opacity: tab.id !== 'home' && !isActive ? 0.6 : 1,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
};

export default CustomTabBar;