import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';

import WordItem from './components/worditem';

import { useGetUserWordList } from '~/queries/hooks/word/useWords';

export default function UserWordListPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, refetch, isRefetching } =
    useGetUserWordList();

  console.log('data', JSON.stringify(data, null, 2));
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allWords =
    data?.pages.flatMap((page) => {
      return Object.entries(page)
        .filter(([key]) => key !== 'page')
        .map(([_, item]: [string, any]) => ({
          word_id: item.word_id,
          word: item.word,
          notes: item.notes,
          part_of_speech: item.part_of_speech,
          meaning_en: item.meaning_en,
          example_sentence: item.example_sentence,
          example_translation: item.example_translation,
          isInUserWordList: true,
        }));
    }) || [];

  //console.log('allWords', JSON.stringify(allWords, null, 2));

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#7b33ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: '내 단어장',
          headerTitleAlign: 'center',
        }}
      />

      {allWords.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-center text-gray-500">저장된 단어가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={allWords}
          renderItem={({ item }) => <WordItem item={item} />}
          keyExtractor={(item) => item.word_id}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color="#7b33ff" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
