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
    return `$${price}`;
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
        flex: 1,
        margin: 3,
        borderRadius: 8,
        overflow: 'hidden',
        padding: 5,
      }}
      lightColor="#F9F9F9"
      darkColor="#2A2A2E"
    >
      <TouchableOpacity onPress={() => router.push(`/event/${event.id}` as any)}>
        <Image
          source={{ uri: event.cover_image_url }}
          style={{ 
            flex: 1, 
            height: 160, 
            width: '100%',
            borderRadius: 5,
          }}
          resizeMode="cover"
        />

        <ThemedView 
          style={{ padding: 8 }}
          lightColor="#F9F9F9"
          darkColor="#2A2A2E"
        >
          <ThemedText
            numberOfLines={2}
            style={{ 
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: 8,
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
              marginBottom: 4,
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
              marginBottom: 6,
            }}
            lightColor="#666666"
            darkColor="#AAAAAA"
          >
            {event.event_location_name}
          </ThemedText>
          
          <ThemedText
            style={{ 
              textAlign: 'center',
              fontSize: 16,
              fontWeight: '600',
            }}
            lightColor={event.base_ticket_price === 0 ? '#4CAF50' : '#2196F3'}
            darkColor={event.base_ticket_price === 0 ? '#66BB6A' : '#64B5F6'}
          >
            {formatPrice(event.base_ticket_price)}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
};