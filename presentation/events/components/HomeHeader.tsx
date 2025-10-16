import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

const HomeHeader = () => {
  const { user, logout } = useAuthStore();
  const primaryColor = useThemeColor({}, 'primary');

  const handleLogout = () => {
    console.log('🚪 Cerrando sesión...');
    logout();
    router.replace('/auth/login');
  };

  const handleNotificationPress = () => {
    console.log('Notificaciones presionadas');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <Pressable 
          style={{ marginRight: 8 }} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color={primaryColor} />
        </Pressable>
        <View>
          <ThemedText style={styles.greetingText} lightColor="#FFFFFF" darkColor="#FFFFFF">
            Bienvenido de vuelta,
          </ThemedText>
          <ThemedText style={styles.userName} lightColor="#FFFFFF" darkColor="#FFFFFF">
            {user?.user_name || 'Usuario'}!
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
});

export default HomeHeader;
