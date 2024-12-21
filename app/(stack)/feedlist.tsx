import { Feather } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import EventListingItem from '~/components/EventListingItem';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { AdBanner } from '~/src/components/ads/AdBanner';

export default function FeedList() {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 15,
    sort: 'latest',
    type: 'SENTENCE',
  });

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];
  const handlePress = () => {
    //console.log('write button pressed');
    router.push('/write/with-words');
  };

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      handlePress();
    });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <AdBanner />
      <Stack.Screen
        options={{
          headerTitle: 'Feed',
          headerRight: () => (
            <View
              style={{
                position: 'absolute',
                right: 0,
                paddingRight: 16,
                flexDirection: 'row',
                alignItems: 'center',
                zIndex: 999,
                elevation: 2,
              }}>
              <GestureDetector gesture={tap}>
                <View
                  style={{
                    padding: 8,
                  }}>
                  <Feather name="edit" size={24} color="#7b33ff" />
                </View>
              </GestureDetector>
            </View>
          ),
        }}
      />
      <FlatList
        data={allPosts}
        renderItem={({ item }) => <EventListingItem event={item} />}
        keyExtractor={(item) => item.post_id.toString()}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f4f4f4' }} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListFooterComponent={() =>
          isLoading ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Platform.OS === 'android' ? 16 : 0,
        }}
      />
    </SafeAreaView>
  );
}
