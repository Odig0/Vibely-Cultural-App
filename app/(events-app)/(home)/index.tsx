import CategoryFilter from '@/presentation/events/components/CategoryFilter'
import EventList from '@/presentation/events/components/EventList'
import HomeHeader from '@/presentation/events/components/HomeHeader'
import SearchBar from '@/presentation/events/components/SearchBar'
import { useEvents } from '@/presentation/events/hooks/useEvents'
import { ThemedText } from '@/presentation/theme/components/ThemedText'
import { ThemedView } from '@/presentation/theme/components/ThemedView'
import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const HomeScreen = () => {
  const { data: events, isLoading, error } = useEvents();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Filtrar eventos por categoría y búsqueda
  const filteredEvents = (events || [])
    .filter(event => {
      // Filtrar por categoría
      if (selectedCategory !== 'all') {
        return event.categories.some(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase());
      }
      return true;
    })
    .filter(event => {
      // Filtrar por búsqueda
      if (searchQuery.trim() === '') return true;
      const query = searchQuery.toLowerCase();
      return event.title.toLowerCase().includes(query) ||
             event.event_location_name.toLowerCase().includes(query) ||
             event.categories.some(cat => cat.name.toLowerCase().includes(query));
    });

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
    <ThemedView style={{ flex: 1 }} lightColor="#FFFFFF" darkColor="#000000">
      {/* Header con saludo, logout y notificaciones */}
      <HomeHeader />

      {/* Barra de búsqueda */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Filtro de categorías */}
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />

      {/* Header con título de sección */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <ThemedText style={{ fontSize: 22, fontWeight: 'bold' }}>
          Eventos disponibles
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