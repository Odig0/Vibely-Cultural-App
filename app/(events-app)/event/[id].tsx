import { useEventById } from '@/presentation/events/hooks/useEventById';
import { useFavorites } from '@/presentation/favorites/hooks/useFavorites';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const EventDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, error } = useEventById(id || '');
  const { toggleFavorite, isFavorite, isSaving } = useFavorites();

  const isEventFavorite = id ? isFavorite(id) : false;

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
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => id && toggleFavorite(id)}
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
          <TouchableOpacity style={styles.mainBuyButton}>
            <ThemedText style={styles.mainBuyButtonText}>
              COMPRAR ENTRADA
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
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
});

export default EventDetailScreen;
