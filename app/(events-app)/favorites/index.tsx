import { EventCard } from '@/presentation/events/components/EventCard';
import { useFavorites } from '@/presentation/favorites/hooks/useFavorites';
import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';

const FavoritesScreen = () => {
  const { favorites, isLoading, refetch } = useFavorites();

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <ThemedText style={{ marginTop: 10 }}>Cargando favoritos...</ThemedText>
      </ThemedView>
    );
  }

  if (favorites.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>
          No tienes eventos guardados
        </ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Guarda tus eventos favoritos para verlos aquí
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} lightColor="#FFFFFF" darkColor="#000000">
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#FF8C00"
          />
        }
        ListHeaderComponent={
          <ThemedView style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>
              Eventos Guardados
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {favorites.length} {favorites.length === 1 ? 'evento' : 'eventos'}
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});

export default FavoritesScreen;
