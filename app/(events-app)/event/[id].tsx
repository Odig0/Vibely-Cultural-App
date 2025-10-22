import { purchaseTicket } from '@/core/tickets/actions/purchaseTicket';
import { useEventById } from '@/presentation/events/hooks/useEventById';
import { useFavorites } from '@/presentation/favorites/hooks/useFavorites';
import { useAuthStore } from '@/presentation/auth/store/useAuthStrore';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
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
import { useQueryClient } from '@tanstack/react-query';

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
          <ThemedView style={styles.modalContent} lightColor="#FFFFFF" darkColor="#1A1A1A">
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Comprar Entradas</ThemedText>
              <TouchableOpacity onPress={() => setShowBuyModal(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Información del evento */}
            <View style={styles.eventInfo}>
              <ThemedText style={styles.eventInfoTitle}>{event?.title}</ThemedText>
              <ThemedText style={styles.eventInfoDate}>
                {event?.starts_at ? formatDate(event.starts_at) : ''}
              </ThemedText>
            </View>

            {/* Selector de cantidad */}
            <View style={styles.quantityContainer}>
              <ThemedText style={styles.quantityLabel}>Cantidad de entradas</ThemedText>
              
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  style={[styles.quantityButton, ticketQuantity === 1 && styles.quantityButtonDisabled]}
                  onPress={decrementQuantity}
                  disabled={ticketQuantity === 1}
                >
                  <Ionicons 
                    name="remove" 
                    size={24} 
                    color={ticketQuantity === 1 ? "#999" : "#FF8C00"} 
                  />
                </TouchableOpacity>

                <View style={styles.quantityDisplay}>
                  <ThemedText style={styles.quantityNumber}>{ticketQuantity}</ThemedText>
                </View>

                <TouchableOpacity
                  style={[styles.quantityButton, ticketQuantity === 10 && styles.quantityButtonDisabled]}
                  onPress={incrementQuantity}
                  disabled={ticketQuantity === 10}
                >
                  <Ionicons 
                    name="add" 
                    size={24} 
                    color={ticketQuantity === 10 ? "#999" : "#FF8C00"} 
                  />
                </TouchableOpacity>
              </View>

              {ticketQuantity === 10 && (
                <ThemedText style={styles.maxQuantityText}>
                  Máximo 10 entradas por compra
                </ThemedText>
              )}
            </View>

            {/* Resumen de compra */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Precio unitario</ThemedText>
                <ThemedText style={styles.summaryValue}>
                  Bs {event?.base_ticket_price || 0}
                </ThemedText>
              </View>
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryLabel}>Cantidad</ThemedText>
                <ThemedText style={styles.summaryValue}>{ticketQuantity}</ThemedText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <ThemedText style={styles.summaryTotalLabel}>Total</ThemedText>
                <ThemedText style={styles.summaryTotalValue}>
                  Bs {(event?.base_ticket_price || 0) * ticketQuantity}
                </ThemedText>
              </View>
            </View>

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  eventInfo: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  eventInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventInfoDate: {
    fontSize: 13,
    opacity: 0.7,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  quantityButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  quantityDisplay: {
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  quantityNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  maxQuantityText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
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
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF8C00',
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default EventDetailScreen;
