import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { useMyTickets } from '@/presentation/tickets/hooks/useMyTickets';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const TicketsScreen = () => {
  const { tickets, isLoading, isError, refetch } = useMyTickets();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const activeTickets = tickets.filter(t => t.status === 'active' || t.status === 'pending');
  const pastTickets = tickets.filter(t => t.status === 'used' || t.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'pending':
        return '#4CAF50';
      case 'used':
        return '#999999';
      case 'cancelled':
        return '#FF4444';
      default:
        return '#999999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
      case 'pending':
        return 'Activo';
      case 'used':
        return 'Usado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return '';
    }
  };

  const handleTicketPress = (ticket: any) => {
    // Navegar al detalle del ticket o evento
    router.push(`/event/${ticket.event_id}` as any);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // Calcular cuánto tiempo hace que se compró
  const getTimeSincePurchase = (dateString: string) => {
    const purchaseDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - purchaseDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  const renderTicket = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleTicketPress(item)}
      activeOpacity={0.7}
      style={styles.ticketCard}
    >
      <ThemedView
        style={styles.ticketContent}
        lightColor="#FFFFFF"
        darkColor="#1A1A1A"
      >
        {/* Imagen del evento */}
        <Image
          source={{ uri: item.event?.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400' }}
          style={styles.ticketImage}
          resizeMode="cover"
        />

        {/* Contenido del ticket */}
        <View style={styles.ticketInfo}>
          {/* Header con estado */}
          <View style={styles.ticketHeader}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + '20' },
              ]}
            >
              <ThemedText
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {getStatusText(item.status)}
              </ThemedText>
            </View>
            <ThemedText style={styles.purchaseDate}>
              {getTimeSincePurchase(item.purchased_at)}
            </ThemedText>
          </View>

          {/* Título del evento */}
          <ThemedText style={styles.ticketTitle} numberOfLines={2}>
            {item.event?.title || 'Evento'}
          </ThemedText>

          {/* Fecha y ubicación */}
          <View style={styles.ticketDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#FF8C00" />
              <ThemedText style={styles.detailText} numberOfLines={1}>
                {item.event?.date ? formatDate(item.event.date) : 'Fecha por confirmar'}
              </ThemedText>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color="#FF8C00" />
              <ThemedText style={styles.detailText} numberOfLines={1}>
                {item.event?.location || 'Ubicación por confirmar'}
              </ThemedText>
            </View>
          </View>

          {/* Footer con cantidad y precio */}
          <View style={styles.ticketFooter}>
            <View style={styles.quantityBadge}>
              <Ionicons name="ticket-outline" size={16} color="#FF8C00" />
              <ThemedText style={styles.quantityText}>
                {item.quantity || 1} {item.quantity === 1 ? 'entrada' : 'entradas'}
              </ThemedText>
            </View>
            <ThemedText style={styles.priceText}>
              Bs {item.price || (item.event?.price * (item.quantity || 1))}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Decoración lateral del ticket */}
      <View style={styles.ticketDecoration}>
        <View style={styles.ticketHole} />
        <View style={styles.ticketHole} />
        <View style={styles.ticketHole} />
      </View>
    </TouchableOpacity>
  );

  // Mostrar loading
  if (isLoading) {
    return (
      <ThemedView style={styles.container} lightColor="#F5F5F5" darkColor="#000000">
        <ThemedView style={styles.header} lightColor="#FFFFFF" darkColor="#1A1A1A">
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF8C00" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Mis Entradas</ThemedText>
          <View style={{ width: 24 }} />
        </ThemedView>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF8C00" />
          <ThemedText style={styles.loadingText}>Cargando entradas...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Mostrar error
  if (isError) {
    return (
      <ThemedView style={styles.container} lightColor="#F5F5F5" darkColor="#000000">
        <ThemedView style={styles.header} lightColor="#FFFFFF" darkColor="#1A1A1A">
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FF8C00" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Mis Entradas</ThemedText>
          <View style={{ width: 24 }} />
        </ThemedView>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF4444" />
          <ThemedText style={styles.errorTitle}>Error al cargar entradas</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <ThemedText style={styles.retryButtonText}>Reintentar</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} lightColor="#F5F5F5" darkColor="#000000">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF8C00"
            colors={['#FF8C00']}
          />
        }
      >
        {/* Header */}
        <ThemedView style={styles.header} lightColor="#FFFFFF" darkColor="#1A1A1A">
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FF8C00" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Mis Entradas</ThemedText>
          <View style={{ width: 24 }} />
        </ThemedView>

        {/* Resumen */}
        <View style={styles.summarySection}>
          <ThemedView style={styles.summaryCard} lightColor="#FFFFFF" darkColor="#1A1A1A">
            <View style={styles.summaryItem}>
              <Ionicons name="ticket" size={32} color="#FF8C00" />
              <ThemedText style={styles.summaryNumber}>{activeTickets.length}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Activas</ThemedText>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              <ThemedText style={styles.summaryNumber}>{pastTickets.length}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Usadas</ThemedText>
            </View>
          </ThemedView>
        </View>

        {/* Entradas activas */}
        {activeTickets.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Entradas Activas</ThemedText>
            <FlatList
              data={activeTickets}
              renderItem={renderTicket}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}

        {/* Entradas pasadas */}
        {pastTickets.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Historial</ThemedText>
            <FlatList
              data={pastTickets}
              renderItem={renderTicket}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        )}

        {/* Estado vacío */}
        {tickets.length === 0 && (
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={64} color="#999" />
            <ThemedText style={styles.emptyTitle}>No tienes entradas</ThemedText>
            <ThemedText style={styles.emptyText}>
              Cuando compres entradas, aparecerán aquí
            </ThemedText>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(events-app)/(home)')}
            >
              <ThemedText style={styles.exploreButtonText}>
                Explorar Eventos
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summarySection: {
    padding: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  ticketCard: {
    marginBottom: 16,
    position: 'relative',
  },
  ticketContent: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E0E0E0',
  },
  ticketInfo: {
    padding: 16,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  purchaseDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 24,
  },
  ticketDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    opacity: 0.8,
    flex: 1,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF8C00',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  ticketDecoration: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -30 }],
    gap: 20,
  },
  ticketHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.6,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TicketsScreen;
