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
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const TicketsScreen = () => {
  const { tickets, isLoading, isError, refetch } = useMyTickets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState<any>(null);
  const [showQRModal, setShowQRModal] = React.useState(false);

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
    // Mostrar modal con QR del ticket
    setSelectedTicket(ticket);
    setShowQRModal(true);
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
      {/* Imagen del evento con estilo ticket - FUERA del ThemedView */}
      <View style={styles.ticketImageWrapperOuter}>
        <View style={styles.ticketImageWrapper}>
          <Image
            source={{ uri: item.event?.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400' }}
            style={styles.ticketImage}
            resizeMode="cover"
          />
          {/* Decoración de ticket - bordes dentados superiores */}
          <ThemedView style={styles.ticketTopNotches} lightColor="#FFFFFF" darkColor="#1A1A1A">
            {Array.from({ length: 14 }).map((_, i) => (
              <ThemedView 
                key={`top-${i}`} 
                style={styles.ticketNotch}
                lightColor="#FFFFFF"
                darkColor="#1A1A1A"
              />
            ))}
          </ThemedView>
          {/* Decoración de ticket - bordes dentados inferiores */}
          <ThemedView style={styles.ticketBottomNotches} lightColor="#FFFFFF" darkColor="#1A1A1A">
            {Array.from({ length: 14 }).map((_, i) => (
              <ThemedView 
                key={`bottom-${i}`} 
                style={styles.ticketNotch}
                lightColor="#FFFFFF"
                darkColor="#1A1A1A"
              />
            ))}
          </ThemedView>
          {/* Esquinas recortadas del ticket */}
          <ThemedView style={styles.ticketCornerTopLeft} lightColor="#FFFFFF" darkColor="#1A1A1A" />
          <ThemedView style={styles.ticketCornerTopRight} lightColor="#FFFFFF" darkColor="#1A1A1A" />
          <ThemedView style={styles.ticketCornerBottomLeft} lightColor="#FFFFFF" darkColor="#1A1A1A" />
          <ThemedView style={styles.ticketCornerBottomRight} lightColor="#FFFFFF" darkColor="#1A1A1A" />
          
          {/* Perforaciones laterales izquierdas */}
          <ThemedView style={styles.ticketLeftNotch1} lightColor="#FFFFFF" darkColor="#1A1A1A" />
          <ThemedView style={styles.ticketLeftNotch2} lightColor="#FFFFFF" darkColor="#1A1A1A" />
          <ThemedView style={styles.ticketLeftNotch3} lightColor="#FFFFFF" darkColor="#1A1A1A" />
        </View>
      </View>

      <ThemedView
        style={styles.ticketContent}
        lightColor="#FFFFFF"
        darkColor="#1A1A1A"
      >

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

      {/* Modal QR del ticket */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.qrModalOverlay}>
          <ThemedView style={styles.qrModalContent} lightColor="#FFFFFF" darkColor="#1A1A1A">
            {/* Header */}
            <View style={styles.qrModalHeader}>
              <ThemedText style={styles.qrModalTitle}>Tu Entrada</ThemedText>
              <TouchableOpacity
                onPress={() => setShowQRModal(false)}
                style={styles.qrCloseButton}
              >
                <Ionicons name="close" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Información del evento */}
            {selectedTicket && (
              <>
                <View style={styles.qrEventInfo}>
                  <ThemedText style={styles.qrEventTitle}>
                    {selectedTicket.event?.title || 'Evento'}
                  </ThemedText>
                  <View style={styles.qrEventDetail}>
                    <Ionicons name="calendar-outline" size={16} color="#FF8C00" />
                    <ThemedText style={styles.qrEventDetailText}>
                      {selectedTicket.event?.date ? formatDate(selectedTicket.event.date) : 'Fecha por confirmar'}
                    </ThemedText>
                  </View>
                  <View style={styles.qrEventDetail}>
                    <Ionicons name="location-outline" size={16} color="#FF8C00" />
                    <ThemedText style={styles.qrEventDetailText}>
                      {selectedTicket.event?.location || 'Ubicación por confirmar'}
                    </ThemedText>
                  </View>
                </View>

                {/* QR Code */}
                <View style={styles.qrCodeContainer}>
                  <Image
                    source={require('@/assets/events/qr.webp')}
                    style={styles.qrCodeImage}
                    resizeMode="contain"
                  />
                  <ThemedText style={styles.qrCodeId}>
                    Código: {selectedTicket.id}
                  </ThemedText>
                </View>

                {/* Badge de estado */}
                <View
                  style={[
                    styles.qrStatusBadge,
                    { backgroundColor: getStatusColor(selectedTicket.status) + '20' },
                  ]}
                >
                  <Ionicons 
                    name={selectedTicket.status === 'active' || selectedTicket.status === 'pending' ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={getStatusColor(selectedTicket.status)} 
                  />
                  <ThemedText
                    style={[
                      styles.qrStatusText,
                      { color: getStatusColor(selectedTicket.status) },
                    ]}
                  >
                    {getStatusText(selectedTicket.status)}
                  </ThemedText>
                </View>

                {/* Instrucciones */}
                <View style={styles.qrInstructions}>
                  <ThemedText style={styles.qrInstructionsText}>
                    Presenta este código QR en la entrada del evento
                  </ThemedText>
                </View>

                {/* Botón para ver detalles del evento */}
                <TouchableOpacity
                  style={styles.qrViewEventButton}
                  onPress={() => {
                    setShowQRModal(false);
                    router.push(`/event/${selectedTicket.event_id}` as any);
                  }}
                >
                  <ThemedText style={styles.qrViewEventButtonText}>
                    Ver Detalles del Evento
                  </ThemedText>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            )}
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
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
    backgroundColor: 'transparent',

  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  ticketCard: {
    marginBottom: 16,
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  ticketImageWrapperOuter: {
    marginBottom: -1,
    paddingHorizontal: 0,
    
  },
  ticketContent: {
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketImageWrapper: {
    position: 'relative',
    overflow: 'visible',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ticketTopNotches: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    zIndex: 2,
  },
  ticketBottomNotches: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
    zIndex: 2,
  },
  ticketNotch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 0,
  },
  ticketCornerTopLeft: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 20,
    height: 20,
    borderBottomRightRadius: 20,
    zIndex: 3,
  },
  ticketCornerTopRight: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 20,
    height: 20,
    borderBottomLeftRadius: 20,
    zIndex: 3,
  },
  ticketCornerBottomLeft: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    width: 20,
    height: 20,
    borderTopRightRadius: 20,
    zIndex: 3,
  },
  ticketCornerBottomRight: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderTopLeftRadius: 20,
    zIndex: 3,
  },
  ticketLeftNotch1: {
    position: 'absolute',
    left: -8,
    top: '25%',
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 3,
  },
  ticketLeftNotch2: {
    position: 'absolute',
    left: -8,
    top: '50%',
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 3,
  },
  ticketLeftNotch3: {
    position: 'absolute',
    left: -8,
    top: '75%',
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 3,
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
  // Estilos del modal QR
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  qrModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  qrCloseButton: {
    padding: 4,
  },
  qrEventInfo: {
    marginBottom: 24,
  },
  qrEventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 26,
  },
  qrEventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  qrEventDetailText: {
    fontSize: 14,
    opacity: 0.8,
    flex: 1,
  },
  qrCodeContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 250,
    height: 250,
    marginBottom: 12,
  },
  qrCodeId: {
    fontSize: 13,
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  qrStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  qrStatusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  qrInstructions: {
    backgroundColor: '#FFF5E6',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF8C00',
    marginBottom: 20,
  },
  qrInstructionsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  qrViewEventButton: {
    flexDirection: 'row',
    backgroundColor: '#FF8C00',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  qrViewEventButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketsScreen;
