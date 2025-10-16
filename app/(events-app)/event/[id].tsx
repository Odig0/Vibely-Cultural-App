import { useEventById } from '@/presentation/events/hooks/useEventById';
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
            resizeMode="contain"
          />
          
          {/* Botón de regreso */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButtonOverlay}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Chip de precio */}
          <View
            style={[
              styles.priceChip,
              {
                backgroundColor:
                  event.base_ticket_price === 0
                    ? 'rgba(76, 175, 80, 0.9)'
                    : 'rgba(255, 140, 0, 0.9)',
              },
            ]}
          >
            <ThemedText style={styles.priceText}>
              {formatPrice(event.base_ticket_price)}
            </ThemedText>
          </View>
        </View>

        {/* Contenido del evento */}
        <View style={styles.contentContainer}>
          {/* Título */}
          <ThemedText style={styles.title}>{event.title}</ThemedText>

          {/* Categorías */}
          {event.categories && event.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {event.categories.map((category, index) => (
                <View key={index} style={styles.categoryChip}>
                  <ThemedText style={styles.categoryText}>
                    {category.name}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Fecha y hora */}
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={24} color="#FF8C00" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Fecha y hora</ThemedText>
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
            <Ionicons name="location-outline" size={24} color="#FF8C00" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Ubicación</ThemedText>
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
              <Ionicons name="chevron-forward" size={20} color="#999" />
            )}
          </TouchableOpacity>

          {/* Capacidad */}
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={24} color="#FF8C00" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoLabel}>Capacidad</ThemedText>
              <ThemedText style={styles.infoValue}>
                {event.capacity} personas
              </ThemedText>
              {event.tickets_sold !== undefined && (
                <ThemedText style={styles.infoSubValue}>
                  {event.tickets_sold} tickets vendidos
                </ThemedText>
              )}
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionContainer}>
            <ThemedText style={styles.sectionTitle}>Acerca del evento</ThemedText>
            <ThemedText style={styles.description}>
              {event.description}
            </ThemedText>
          </View>

          {/* Redes sociales */}
          {event.artist_social_links && (
            <View style={styles.socialLinksContainer}>
              <ThemedText style={styles.sectionTitle}>Redes sociales</ThemedText>
              <View style={styles.socialLinks}>
                {event.artist_social_links.instagram && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(event.artist_social_links!.instagram!)
                    }
                    style={styles.socialButton}
                  >
                    <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                    <ThemedText style={styles.socialText}>Instagram</ThemedText>
                  </TouchableOpacity>
                )}
                {event.artist_social_links.facebook && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(event.artist_social_links!.facebook!)
                    }
                    style={styles.socialButton}
                  >
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                    <ThemedText style={styles.socialText}>Facebook</ThemedText>
                  </TouchableOpacity>
                )}
                {event.artist_social_links.twitter && (
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(event.artist_social_links!.twitter!)
                    }
                    style={styles.socialButton}
                  >
                    <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                    <ThemedText style={styles.socialText}>Twitter</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón flotante de compra */}
      <View style={styles.bottomBar}>
        <View>
          <ThemedText style={styles.bottomPrice}>
            {formatPrice(event.base_ticket_price)}
          </ThemedText>
          {!event.is_free && (
            <ThemedText style={styles.bottomSubtext}>por persona</ThemedText>
          )}
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <ThemedText style={styles.buyButtonText}>
            {event.is_free ? 'Registrarse' : 'Comprar ticket'}
          </ThemedText>
        </TouchableOpacity>
      </View>
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
    height: 350,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
    zIndex: 10,
  },
  priceChip: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#FF8C00',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSubValue: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  socialLinksContainer: {
    marginBottom: 30,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  socialText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    backgroundColor: '#000000',
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  bottomSubtext: {
    fontSize: 12,
    opacity: 0.6,
  },
  buyButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
});

export default EventDetailScreen;
