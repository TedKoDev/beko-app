import { Stack } from 'expo-router';
import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useAuthStore } from '~/store/authStore';
import EventListingItem from '~/components/EventListingItem';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adUnitId } from '~/src/config/ads';

export default function MyPostsScreen() {
  const userInfo = useAuthStore((state) => state.userInfo);

  const { data, fetchNextPage, hasNextPage, isLoading } = usePosts({
    page: 1,
    limit: 10,
    sort: 'latest',
    check_id: userInfo?.user_id || 0,
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="w-full ">
        <BannerAd
          unitId={adUnitId ?? ''}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
      <Stack.Screen
        options={{
          title: 'My Posts',
          headerTitleAlign: 'center',
        }}
      />
      <FlatList
        data={data?.pages.flatMap((page) => page.data) || []}
        renderItem={({ item }) => <EventListingItem event={item} />}
        keyExtractor={(item) => item.post_id.toString()}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-gray-500">No posts yet</Text>
          </View>
        )}
      />
    </View>
  );
}
