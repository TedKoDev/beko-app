import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import EventSmallListItem from '../EventsmallListingItem';

import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useBoardStore } from '~/store/boardStore';

interface Post {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  location: string;
}

export function BelaPick() {
  const { data: posts, isLoading: postsLoading } = usePosts({
    page: 1,
    limit: 5,
    sort: 'latest',
    admin_pick: true,
    topicId: undefined,
    categoryId: undefined,
  });

  const { cachedPosts, setCachedPosts } = useBoardStore();
  const postItems = cachedPosts.Bera.length > 0 ? cachedPosts.Bera : posts?.pages[0]?.data || [];

  useEffect(() => {
    if (posts?.pages[0]?.data) {
      setCachedPosts('Bera', posts.pages[0].data);
    }
  }, [posts]);

  return (
    <View className="pt-5 ">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Text className="text-xl font-bold">Bera's Pick</Text>
          <Text className="ml-2 text-xl text-[#7b33ff]">✓</Text>
        </View>
        <Link href="/board/bella-picks" asChild>
          <TouchableOpacity>
            <Text className="text-sm text-[#FF6B6B]">See all</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Posts List */}
      <View>
        {postItems.length > 0 ? (
          postItems
            .slice(0, 5)
            .map((event: any) => <EventSmallListItem key={event.post_id} event={event} />)
        ) : (
          <View className="flex h-[72px] items-center justify-center bg-white">
            <Text className="text-gray-500">There is no bera's pick</Text>
          </View>
        )}
      </View>
    </View>
  );
}
