// 한국학교 목록 페이지

import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';

import { useGetSchools } from '~/queries/hooks/schools/useSchools';
import { School } from '~/types/school';

export default function KoreanSchoolsScreen() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useGetSchools();

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: School }) => (
    <View className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
      <View className="mb-1 flex-row items-center">
        <View className="mr-2 h-2 w-2 rounded-full bg-violet-500" />
        <Text className="text-xs font-medium text-violet-500">
          {item.region}, {item.country_code}
        </Text>
      </View>

      <Text className="mb-1 text-lg font-bold text-gray-800">{item.name_ko}</Text>
      <Text className="mb-4 text-sm text-gray-500">{item.name_en}</Text>

      {item.website_url && (
        <TouchableOpacity
          className="flex-row items-center self-start rounded-lg bg-violet-50 px-4 py-2"
          onPress={() => handleOpenWebsite(item.website_url)}>
          <Feather name="globe" size={16} color="#8B5CF6" />
          <Text className="ml-2 text-sm font-medium text-violet-600">Visit Website</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: 'Korean Schools Info',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerRight: () => null,
        }}
      />

      <FlatList
        data={allItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.school_id.toString()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator className="py-4" color="#8B5CF6" /> : null
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-base text-gray-500">No schools found</Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingBottom: Platform.OS === 'android' ? 16 : 0,
        }}
        className="px-4"
      />
    </SafeAreaView>
  );
}
