import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'event' | 'favorite' | 'reminder' | 'general';
  read: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  eventId?: string;
}

// Notificaciones hardcodeadas
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: '🎉 Nuevo evento cerca de ti',
    message: 'Tortuakos — Rock en Vivo estará este viernes en Pub La Estación. ¡No te lo pierdas!',
    time: 'Hace 2 horas',
    type: 'event',
    read: false,
    icon: 'calendar',
    eventId: '1',
  },
  {
    id: '2',
    title: '⭐ Evento en favoritos próximamente',
    message: 'FENAVID — Proyección de Película comienza en 3 días. ¿Ya tienes tu entrada?',
    time: 'Hace 5 horas',
    type: 'reminder',
    read: false,
    icon: 'heart',
    eventId: '2',
  },
];

const NotificationsScreen = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationPress = (notification: Notification) => {
    // Solo marcar como leída, sin navegar
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'event':
        return '#FF8C00';
      case 'favorite':
        return '#FF4444';
      case 'reminder':
        return '#4CAF50';
      default:
        return '#2196F3';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <ThemedView
        style={[
          styles.notificationCard,
          !item.read && styles.unreadNotification,
        ]}
        lightColor={!item.read ? '#FFF5E6' : '#FFFFFF'}
        darkColor={!item.read ? '#2A2A2A' : '#1A1A1A'}
      >
        {/* Badge de no leído */}
        {!item.read && <View style={styles.unreadBadge} />}

        {/* Contenedor con icono y contenido */}
        <View style={styles.notificationContent}>
          {/* Icono */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: getIconColor(item.type) + '20' },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={getIconColor(item.type)}
            />
          </View>

          {/* Texto */}
          <View style={styles.textContainer}>
            <ThemedText style={styles.notificationTitle}>
              {item.title}
            </ThemedText>
            <ThemedText
              style={styles.notificationMessage}
              numberOfLines={2}
            >
              {item.message}
            </ThemedText>
            <ThemedText style={styles.notificationTime}>
              {item.time}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container} lightColor="#F5F5F5" darkColor="#000000">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header} lightColor="#FFFFFF" darkColor="#1A1A1A">
          <ThemedText style={styles.headerTitle}>Notificaciones</ThemedText>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <ThemedText style={styles.markAllButton}>
                Marcar todas como leídas
              </ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Badge de notificaciones no leídas */}
        {unreadCount > 0 && (
          <ThemedView style={styles.unreadCountContainer} lightColor="#FFF5E6" darkColor="#2A2A2A">
            <ThemedText style={styles.unreadCountText}>
              Tienes {unreadCount} {unreadCount === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
            </ThemedText>
          </ThemedView>
        )}

        {/* Lista de notificaciones */}
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ThemedView style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#999" />
              <ThemedText style={styles.emptyText}>
                No tienes notificaciones
              </ThemedText>
            </ThemedView>
          }
        />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  markAllButton: {
    fontSize: 14,
    color: '#FF8C00',
    fontWeight: '600',
  },
  unreadCountContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  unreadCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
  },
  listContainer: {
    padding: 20,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
  },
  unreadBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C00',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 20,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    marginTop: 16,
  },
});

export default NotificationsScreen;
