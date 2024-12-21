import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useSearch, useSearchPosts, useSearchUsers } from '~/queries/hooks/search/useSearch';

enum PostType {
  GENERAL = 'GENERAL',
  COLUMN = 'COLUMN',
  QUESTION = 'QUESTION',
  SENTENCE = 'SENTENCE',
}

interface SearchResult {
  post_id: number;
  type: PostType;
  post_content: {
    title: string;
    content: string;
    points?: number;
    isAnswered?: boolean;
  };
  user: {
    user_id: number;
    username: string;
    profile_picture_url?: string;
  };
  views: number;
  likes: number;
  created_at: string;
  media?: {
    url: string;
  }[];
}

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'all' | PostType>('all');

  const { data: searchData } = useSearch(q as string);

  //console.log('searchData', JSON.stringify(searchData, null, 2));

  const renderItem = (item: SearchResult) => {
    switch (item.type) {
      case PostType.GENERAL:
      case PostType.COLUMN:
        return (
          <TouchableOpacity
            key={item.post_id}
            className="mb-4 border-b border-gray-100 p-4"
            onPress={() => router.push(`/event/${item.post_id}`)}>
            <Text className="mb-2 text-lg">{item.post_content.title}</Text>
            <View className="flex-row space-x-4">
              <Text className="text-gray-500">좋아요 {item.likes}</Text>
              <Text className="text-gray-500">조회 {item.views}</Text>
            </View>
            {item.media?.[0] && (
              <Image source={{ uri: item.media[0].url }} className="mt-2 h-40 w-full rounded-lg" />
            )}
          </TouchableOpacity>
        );

      case PostType.QUESTION:
        return (
          <TouchableOpacity
            key={item.post_id}
            className="mb-4 border-b border-gray-100 p-4"
            onPress={() => router.push(`/event/${item.post_id}`)}>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg">{item.post_content.title}</Text>
              {item.post_content.isAnswered ? (
                <View className="rounded-full bg-green-100 px-2 py-1">
                  <Text className="text-sm text-green-600">답변완료</Text>
                </View>
              ) : (
                <View className="rounded-full bg-orange-100 px-2 py-1">
                  <Text className="text-sm text-orange-600">답변대기</Text>
                </View>
              )}
            </View>
            <View className="mt-2 flex-row space-x-4">
              <Text className="text-gray-500">포인트 {item.post_content.points}</Text>
              <Text className="text-gray-500">조회 {item.views}</Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'Search Results',
          headerRight: () => null,
        }}
      />
      <View className="p-4">
        <Text className="mb-4 text-lg">
          <Text className="font-bold">{q}</Text>에 대한 검색결과
        </Text>
      </View>

      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          className={`flex-1 p-4 ${activeTab === 'all' ? 'border-b-2 border-purple-custom' : ''}`}>
          <Text
            className={`text-center ${activeTab === 'all' ? 'font-bold text-purple-custom' : 'text-gray-500'}`}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(PostType.GENERAL)}
          className={`flex-1 p-4 ${activeTab === PostType.GENERAL ? 'border-b-2 border-purple-custom' : ''}`}>
          <Text
            className={`text-center ${activeTab === PostType.GENERAL ? 'font-bold text-purple-custom' : 'text-gray-500'}`}>
            General
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab(PostType.QUESTION)}
          className={`flex-1 p-4 ${activeTab === PostType.QUESTION ? 'border-b-2 border-purple-custom' : ''}`}>
          <Text
            className={`text-center ${activeTab === PostType.QUESTION ? 'font-bold text-purple-custom' : 'text-gray-500'}`}>
            Question
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(PostType.COLUMN)}
          className={`flex-1 p-4 ${activeTab === PostType.COLUMN ? 'border-b-2 border-purple-custom' : ''}`}>
          <Text
            className={`text-center ${activeTab === PostType.COLUMN ? 'font-bold text-purple-custom' : 'text-gray-500'}`}>
            Notice
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        {searchData?.postsByContent
          .filter((post) => activeTab === 'all' || post.type === activeTab)
          .map(renderItem)}
      </View>
    </ScrollView>
  );
}
