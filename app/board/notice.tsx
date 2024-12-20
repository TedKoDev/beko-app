import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';

export default function NoticeScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const [sort, setSort] = useState<'latest' | 'oldest' | 'popular'>('latest');
  const { data: topics } = useTopics();

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
    type: 'COLUMN',
    categoryId: categoryId ? parseInt(categoryId) : undefined,
  });

  const postItems = posts?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const renderSortButton = (type: 'latest' | 'oldest' | 'popular', label: string) => (
    <TouchableOpacity
      onPress={() => setSort(type)}
      className={`rounded-full px-3 py-1 ${sort === type ? 'bg-purple-100' : 'bg-gray-100'}`}>
      <Text className={sort === type ? 'text-purple-custom' : 'text-gray-600'}>{label}</Text>
    </TouchableOpacity>
  );

  // Notice 토픽의 현재 카테고리 이름 찾기
  const noticeTopic = topics?.find((topic) => topic.title === 'Notice');
  const currentCategory = noticeTopic?.category.find(
    (cat) => cat.category_id === parseInt(categoryId || '0')
  );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: currentCategory?.category_name || 'Notice',
        }}
      />

      <View className="mb-4 flex-row justify-end gap-2 border-b border-gray-200 px-4 py-4">
        {renderSortButton('latest', 'Latest')}
        {renderSortButton('oldest', 'Oldest')}
        {renderSortButton('popular', 'Popular')}
      </View>

      <ListLayout
        headerTitle=""
        data={postItems}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        onRefresh={refetch}
        isRefreshing={isRefetching}
        showViewToggle={false}
        // hideButton
        showWriteButton={false}
      />
    </View>
  );
}
