import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';

export default function HotScreen() {
  const [sort, setSort] = useState<'latest' | 'oldest' | 'popular'>('popular');

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 25,
    sort,
  });

  const postItems = posts?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const sortOptions = [
    { type: 'latest', label: 'Latest' },
    { type: 'oldest', label: 'Oldest' },
    { type: 'popular', label: 'Popular' },
  ] as const;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'Hot Posts',
        }}
      />

      <View className="mb-4 flex-row justify-end gap-2 border-b border-gray-200 px-4 py-4">
        {sortOptions.map(({ type, label }) => (
          <TouchableOpacity
            key={type}
            onPress={() => setSort(type)}
            className={`rounded-full px-3 py-1 ${sort === type ? 'bg-purple-100' : 'bg-gray-100'}`}>
            <Text className={sort === type ? 'text-purple-600' : 'text-gray-600'}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ListLayout
        headerTitle=""
        data={postItems}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        showViewToggle
        // hideButton
        showWriteButton={false}
      />
    </View>
  );
}
