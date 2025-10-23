import { purchaseTicket } from '@/core/tickets/actions/purchaseTicket';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { useEventById } from '@/presentation/events/hooks/useEventById';
import { useFavorites } from '@/presentation/favorites/hooks/useFavorites';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Linking,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, error } = useEventById(id || '');
  const { toggleFavorite, isFavorite, isSaving } = useFavorites();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const isEventFavorite = id ? isFavorite(id) : false;
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleToggleFavorite = () => {
    if (id && event) {
      // Feedback háptico inmediato
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleFavorite(id, event);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    try {
      // Feedback háptico
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const message = `🎉 ¡Mira este evento!\n\n` +
        `📅 ${event.title}\n\n` +
        `📍 ${event.event_location_name}\n` +
        `🗓️ ${formatDate(event.starts_at)}\n` +
        `💰 ${formatPrice(event.base_ticket_price)}\n\n` +
        `¡No te lo pierdas!`;

      const result = await Share.share({
        message: message,
        title: event.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con actividad específica
          console.log('Compartido con:', result.activityType);
        } else {
          // Compartido
          console.log('Evento compartido');
        }
      } else if (result.action === Share.dismissedAction) {
        // Cancelado
        console.log('Compartir cancelado');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo compartir el evento. Por favor, inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
      console.error('Error al compartir:', error);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) {
      return 'GRATIS';
    }
    return `Bs ${price}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${dayName}, ${dayNumber} de ${monthName} de ${year} • ${hours}:${minutes}`;
  };

  const openLocation = () => {
    if (event?.event_location_url) {
      Linking.openURL(event.event_location_url);
    }
  };

  const handleBuyPress = () => {
    if (!event) return;
    
    if (event.is_free || event.base_ticket_price === 0) {
      // Si es gratis, confirmar asistencia directamente
      Alert.alert(
        '✅ Confirmado',
        '¡Has confirmado tu asistencia al evento gratuito!',
        [{ text: 'OK' }]
      );
    } else {
      // Si tiene precio, abrir modal de compra
      setShowBuyModal(true);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!id || !token) {
      Alert.alert('Error', 'Debes iniciar sesión para comprar entradas');
      return;
    }

    setIsPurchasing(true);
    
    try {
      // Realizar una única compra con la cantidad seleccionada
      await purchaseTicket(
        {
          event_id: id,
          quantity: ticketQuantity,
        },
        token
      );

      // Feedback háptico de éxito
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Invalidar cache de tickets para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['tickets', 'my-tickets'] });
      
      setShowBuyModal(false);
      
      const total = (event?.base_ticket_price || 0) * ticketQuantity;
      
      Alert.alert(
        '🎉 ¡Compra Exitosa!',
        `Has comprado ${ticketQuantity} ${ticketQuantity === 1 ? 'entrada' : 'entradas'} por Bs ${total}.\n\n¡Nos vemos en el evento!`,
        [
          {
            text: 'Ver Mis Entradas',
            onPress: () => {
              setTicketQuantity(1);
              router.push('/(events-app)/tickets' as any);
            }
          },
          {
            text: 'OK',
            onPress: () => setTicketQuantity(1)
          }
        ]
      );
    } catch (error) {
      console.error('Error al comprar tickets:', error);
      Alert.alert(
        'Error',
        'No se pudo completar la compra. Por favor, inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const incrementQuantity = () => {
    if (ticketQuantity < 10) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTicketQuantity(ticketQuantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (ticketQuantity > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTicketQuantity(ticketQuantity - 1);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <ThemedText style={{ marginTop: 10 }}>Cargando evento...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !event) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ textAlign: 'center', color: 'red' }}>
          Error al cargar el evento. Por favor intenta nuevamente.
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ThemedText style={{ color: '#FF8C00' }}>Volver</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }} lightColor="#FFFFFF" darkColor="#000000">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen de portada */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.cover_image_url }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          
          {/* Botón de regreso */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButtonOverlay}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Botones superiores derecha */}
          <View style={styles.topRightButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleToggleFavorite}
              disabled={isSaving}
            >
              <Ionicons 
                name={isEventFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isEventFavorite ? "#FF8C00" : "#FFFFFF"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido del evento */}
        <ThemedView style={styles.contentContainer} lightColor="#FFFFFF" darkColor="#000000">
          {/* Título */}
          <ThemedText style={styles.title}>{event.title}</ThemedText>


               {/* Precio */}
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="cash-outline" size={20} color="#FF8C00" />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={[styles.infoValue, { 
                color: event.base_ticket_price === 0 ? '#4CAF50' : '#FF8C00',
                fontWeight: '600'
              }]}>
                {formatPrice(event.base_ticket_price)}
              </ThemedText>
            </View>
          </View>

          
          {/* Fecha y hora */}
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={20} color="#FF8C00" />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoValue}>
                {formatDate(event.starts_at)}
              </ThemedText>
            </View>
          </View>

          {/* Ubicación */}
          <TouchableOpacity
            style={styles.infoRow}
            onPress={openLocation}
            disabled={!event.event_location_url}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="location-outline" size={20} color="#FF8C00" />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoValue}>
                {event.event_location_name}
              </ThemedText>
              {event.event_location_address && (
                <ThemedText style={styles.infoSubValue}>
                  {event.event_location_address}
                </ThemedText>
              )}
            </View>
            {event.event_location_url && (
              <Ionicons name="chevron-forward" size={20} color="#FF8C00" />
            )}
          </TouchableOpacity>

     

          {/* Botón de compra grande */}
          <TouchableOpacity 
            style={styles.mainBuyButton}
            onPress={handleBuyPress}
          >
            <ThemedText style={styles.mainBuyButtonText}>
              {event.is_free || event.base_ticket_price === 0 
                ? 'CONFIRMAR ASISTENCIA' 
                : 'COMPRAR ENTRADA'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {/* Modal de compra */}
      <Modal
        visible={showBuyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBuyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#1F1F1F">
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Comprar Entradas</ThemedText>
              <TouchableOpacity 
                onPress={() => setShowBuyModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Card de tipo de entrada */}
            <ThemedView style={styles.ticketTypeCard} lightColor="#F8F8F8" darkColor="#2A2A2A">
              <View style={styles.ticketTypeHeader}>
                <View style={styles.ticketTypeBadge}>
                  <Ionicons name="ticket" size={20} color="#FF8C00" />
                </View>
                <View style={styles.ticketTypeInfo}>
                  <ThemedText style={styles.ticketTypeName}>Entrada General</ThemedText>
                </View>
              </View>
              
              <View style={styles.ticketPriceRow}>
                <ThemedText style={styles.ticketPriceLabel}>Valor</ThemedText>
                <ThemedText style={styles.ticketPrice}>
                  Bs {event?.base_ticket_price || 0}/-
                </ThemedText>
              </View>

              <View style={styles.ticketQuantityRow}>
                <ThemedText style={styles.ticketQuantityLabel}>Cantidad</ThemedText>
                <View style={styles.ticketQuantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityControlButton, ticketQuantity === 1 && styles.quantityControlButtonDisabled]}
                    onPress={decrementQuantity}
                    disabled={ticketQuantity === 1}
                  >
                    <Ionicons 
                      name="remove" 
                      size={20} 
                      color={ticketQuantity === 1 ? "#999" : "#FFFFFF"} 
                    />
                  </TouchableOpacity>

                  <ThemedView style={styles.quantityValueContainer} lightColor="#FFFFFF" darkColor="#1F1F1F">
                    <ThemedText style={styles.quantityValue}>{ticketQuantity}</ThemedText>
                  </ThemedView>

                  <TouchableOpacity
                    style={[styles.quantityControlButton, ticketQuantity === 10 && styles.quantityControlButtonDisabled]}
                    onPress={incrementQuantity}
                    disabled={ticketQuantity === 10}
                  >
                    <Ionicons 
                      name="add" 
                      size={20} 
                      color={ticketQuantity === 10 ? "#999" : "#FFFFFF"} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ThemedView>

            {ticketQuantity === 10 && (
              <ThemedText style={styles.maxQuantityWarning}>
                ⓘ Máximo 10 entradas por compra
              </ThemedText>
            )}

            {/* Resumen de total */}
            <ThemedView style={styles.totalSummaryCard} lightColor="#FFF5E6" darkColor="#2A2A2A">
              <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Total a pagar</ThemedText>
                <ThemedText style={styles.totalAmount}>
                  Bs {(event?.base_ticket_price || 0) * ticketQuantity}
                </ThemedText>
              </View>
              <ThemedText style={styles.totalDetails}>
                {ticketQuantity} {ticketQuantity === 1 ? 'entrada' : 'entradas'} × Bs {event?.base_ticket_price || 0}
              </ThemedText>
            </ThemedView>

            {/* Botones de acción */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowBuyModal(false)}
                disabled={isPurchasing}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, isPurchasing && styles.confirmButtonDisabled]}
                onPress={handleConfirmPurchase}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <ThemedText style={styles.confirmButtonText}>
                    Confirmar Compra
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
    backgroundColor: '#000000',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    padding: 10,
    zIndex: 10,
  },
  topRightButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    padding: 10,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 26,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '400',
  },
  infoSubValue: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 1,
  },
  mainBuyButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  mainBuyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 32,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: 4,
  },
  ticketTypeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  ticketTypeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ticketTypeInfo: {
    flex: 1,
  },
  ticketTypeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  ticketTypeSubtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
  ticketPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketPriceLabel: {
    fontSize: 15,
    opacity: 0.7,
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ticketQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketQuantityLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  ticketQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityControlButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityControlButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  quantityValueContainer: {
    minWidth: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  maxQuantityWarning: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 20,
    textAlign: 'center',
  },
  totalSummaryCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFD699',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.8,
  },
  totalAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  totalDetails: {
    fontSize: 13,
    opacity: 0.6,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1.5,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default EventDetailScreen;
