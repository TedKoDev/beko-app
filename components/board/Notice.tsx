import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import EventSmallListItem from '../EventsmallListingItem';

import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useBoardStore } from '~/store/boardStore';

export default function Notice() {
  const { data: posts } = usePosts({
    page: 1,
    limit: 5,
    sort: 'latest',
    type: 'COLUMN',
    topicId: undefined,
    categoryId: undefined,
  });

  const { cachedPosts, setCachedPosts } = useBoardStore();
  const postItems =
    cachedPosts.notice.length > 0 ? cachedPosts.notice : posts?.pages[0]?.data || [];

  useEffect(() => {
    if (posts?.pages[0]?.data) {
      setCachedPosts('notice', posts.pages[0].data);
    }
  }, [posts]);

  return (
    <View className="pt-5">
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">Notice</Text>
          <Text className="ml-2 text-xl text-[#7b33ff]">📢</Text>
        </View>
        <Link href="/board/notice" asChild>
          <TouchableOpacity>
            <Text className="text-sm text-[#FF6B6B]">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View>
        {postItems.length > 0 ? (
          postItems
            .slice(0, 5)
            .map((event: any) => <EventSmallListItem key={event.post_id} event={event} />)
        ) : (
          <View className="flex h-[72px] items-center justify-center bg-white">
            <Text className="text-gray-500">There is no posts</Text>
          </View>
        )}
      </View>
    </View>
  );
}
