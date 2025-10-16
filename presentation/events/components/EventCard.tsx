import { router } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';

import { Event } from '@/core/events/interfaces/event.interface';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';

interface Props {
  event: Event;
}

export const EventCard = ({ event }: Props) => {
  const formatPrice = (price: number) => {
    if (price === 0) {
      return 'GRATIS';
    }
    return `Bs ${price}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${dayNumber} de ${monthName} de ${year}`;
  };

  return (
    <ThemedView
      style={{
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 16,
        overflow: 'hidden',
        padding: 0,
      }}
      lightColor="#F9F9F9"
      darkColor="#20232A"
    >
      <TouchableOpacity onPress={() => router.push(`/event/${event.id}` as any)}>
        <ThemedView style={{ position: 'relative' }}>
          <Image
            source={{ uri: event.cover_image_url }}
            style={{ 
              height: 280, 
              width: '100%',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
            resizeMode="cover"
          />
          
          {/* Chip de precio en esquina superior derecha */}
          <ThemedView
            style={{
              position: 'absolute',
              top: -1,
              right: -1,
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: event.base_ticket_price === 0 
                ? 'rgba(76, 175, 80, 0.85)' // Verde semi-transparente
                : 'rgba(33, 150, 243, 0.85)', // Azul semi-transparente
            }}
          >
            <ThemedText
              style={{ 
                fontSize: 12,
                fontWeight: '600',
                color: '#FFFFFF',
              }}
            >
              {formatPrice(event.base_ticket_price)}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView 
          style={{ padding: 12 }}
          lightColor="#F9F9F9"
          darkColor="#1A1A1A"
        >
          <ThemedText
            numberOfLines={2}
            style={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 10,
              fontSize: 16,
            }}
            lightColor="#1A1A1A"
            darkColor="#FFFFFF"
          >
            {event.title}
          </ThemedText>
          
          <ThemedText
            numberOfLines={1}
            style={{ 
              textAlign: 'center',
              fontSize: 13,
              fontWeight: '500',
              marginBottom: 6,
            }}
            lightColor="#FF8C00"
            darkColor="#FFB347"
          >
            {formatDate(event.starts_at)}
          </ThemedText>
          
          <ThemedText
            numberOfLines={1}
            style={{ 
              textAlign: 'center',
              fontSize: 12,
            }}
            lightColor="#666666"
            darkColor="#AAAAAA"
          >
            {event.event_location_name}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
};