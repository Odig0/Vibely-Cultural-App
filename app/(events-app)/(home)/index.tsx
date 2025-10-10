import CategoryFilter from '@/presentation/events/components/CategoryFilter'
import EventList from '@/presentation/events/components/EventList'
import { useEvents } from '@/presentation/events/hooks/useEvents'
import { ThemedText } from '@/presentation/theme/components/ThemedText'
import { ThemedView } from '@/presentation/theme/components/ThemedView'
import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const HomeScreen = () => {
  const { data: events, isLoading, error } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categorías basadas en tu API
  const categories = [
    { id: 'all', name: 'Todas las fechas', color: 'gray' as const },
    { id: 'tecnologia', name: 'Tecnología', color: 'orange' as const },
    { id: 'arte', name: 'Arte', color: 'purple' as const },
    { id: 'musica', name: 'Música', color: 'orange' as const },
    { id: 'cine', name: 'Cine', color: 'purple' as const },
    { id: 'fiesta', name: 'Fiesta', color: 'orange' as const },
  ];

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };



  // Filtrar eventos por categoría
  const filteredEvents = selectedCategory === 'all' 
    ? events || []
    : (events || []).filter(event => 
        event.categories.some(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase())
      );

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={{ marginTop: 10 }}>Cargando eventos...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <ThemedText style={{ textAlign: 'center', color: 'red' }}>
          Error cargando eventos. Por favor intenta nuevamente.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Filtro de categorías */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />

      {/* Header con título de sección */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <ThemedText style={{ fontFamily: 'Kanit-Regular', fontSize: 18 }}>
          Eventos disponibles:
        </ThemedText>
      </View>

      {/* Lista de eventos */}
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <EventList events={filteredEvents} />
      </View>
    </ThemedView>
  )
}

export default HomeScreen