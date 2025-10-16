import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Event } from '@/core/events/interfaces/event.interface';
import { EventCard } from './EventCard';

interface Props {
  events: Event[];
  loadNextPage?: () => void;
}

const EventList = ({ events, loadNextPage }: Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    queryClient.invalidateQueries({
      queryKey: ['events'],
    });

    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={events}
      numColumns={1}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EventCard event={item} />}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onPullToRefresh} />
      }
    />
  );
};

export default EventList;