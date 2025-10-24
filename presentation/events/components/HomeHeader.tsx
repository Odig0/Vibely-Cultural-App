import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

const HomeHeader = () => {
  const { user, logout } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
    router.replace('/auth/login');
  };

  const handleNotificationPress = () => {
    router.push('/(events-app)/notifications');
  };

  const handleProfilePress = () => {
    setMenuVisible(true);
  };

  // Contador de notificaciones no leídas (hardcodeado)
  const unreadNotificationsCount = 2;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={handleProfilePress}
        >
          <Ionicons name="person-circle-outline" size={40} color="#FF8C00" />
        </TouchableOpacity>
        <View style={{ paddingTop: 15 }}>
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
        {unreadNotificationsCount > 0 && (
          <View style={styles.notificationBadge}>
            <ThemedText style={styles.notificationBadgeText}>
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>

      {/* Menú desplegable del perfil */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Ionicons name="person-circle" size={50} color="#FF8C00" />
              <ThemedText style={styles.menuUserName} lightColor="#FFFFFF" darkColor="#FFFFFF">
                {user?.user_name || 'Usuario'}
              </ThemedText>
              <ThemedText style={styles.menuUserEmail} lightColor="#AAAAAA" darkColor="#AAAAAA">
                {user?.email || 'usuario@ejemplo.com'}
              </ThemedText>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#FF8C00" />
              <ThemedText style={styles.menuItemText} lightColor="#FFFFFF" darkColor="#FFFFFF">
                Cerrar Sesión
              </ThemedText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000000',
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
  profileButton: {
    marginRight: 12,
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingLeft: 20,
  },
  menuContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  menuUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  menuUserEmail: {
    fontSize: 13,
    marginTop: 4,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default HomeHeader;
