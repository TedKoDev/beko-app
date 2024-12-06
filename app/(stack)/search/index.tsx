import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import debounce from 'lodash/debounce';
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';
import { usePopularSearches } from '~/queries/hooks/search/useSearch';
import { useRecentSearchStore } from '~/store/recentSearchStore';

interface Category {
  category_id: number;
  category_name: string;
  base_price: number;
}
export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: popularSearches } = usePopularSearches();
  // console.log('popularSearches', JSON.stringify(popularSearches, null, 2));

  const { searches: recentSearches, removeSearch } = useRecentSearchStore();
  const { data: topics } = useTopics();

  // 모든 카테고리를 하나의 배열로 만들고 랜덤으로 선택
  const recommendedCategories = React.useMemo(() => {
    if (!topics) return [];

    // 모든 카테고리를 하나의 배열로 합치기
    const allCategories = topics
      .flatMap((topic) => topic.category)
      .filter((category): category is Category => category !== null);

    // 배열을 섞고 랜덤하게 8개 선택
    return [...allCategories].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [topics]);

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        useRecentSearchStore.getState().addSearch(query.trim());
        router.push(`/search/results?q=${encodeURIComponent(query)}`);
      }
    }, 1000), // 1초 디바운스
    []
  );

  // 검색어가 변경될 때마다 디바운스된 검색 실행
  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    // 컴포넌트가 언마운트되면 디바운스 취소
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  // 새로고침 처리
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['popularSearches'] });
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const getTrendIcon = (trend: string, difference?: number) => {
    switch (trend.toUpperCase()) {
      case 'UP':
        return <Text className="text-red-500">{difference ? `+${difference}` : ''} ▲</Text>;
      case 'DOWN':
        return <Text className="text-blue-500">{difference ? `-${difference}` : ''} ▼</Text>;
      case 'NEW':
        return <Text className="text-red-500">N</Text>;
      default:
        return <Text className="text-gray-500">-</Text>;
    }
  };

  // 순위가 없는(0) 검색어들
  const unrankedSearches =
    popularSearches
      ?.filter((search) => search.currentRank === 0)
      .sort((a, b) => new Date(b.checkTime).getTime() - new Date(a.checkTime).getTime()) || [];

  // 순위별로 그룹화하는 함수
  const groupByRank = (searches: typeof popularSearches) => {
    const rankGroups = new Map<number, typeof popularSearches>();

    searches?.forEach((search) => {
      if (search.currentRank > 0) {
        if (!rankGroups.has(search.currentRank)) {
          rankGroups.set(search.currentRank, []);
        }
        rankGroups.get(search.currentRank)?.push(search);
      }
    });

    return rankGroups;
  };

  // 순위가 있는 검색어 그룹화
  const rankGroups = groupByRank(popularSearches);
  const sortedRanks = Array.from(rankGroups.keys()).sort((a, b) => a - b);

  // 검색어 클릭 핸들러
  const handleSearchClick = (keyword: string) => {
    setSearchQuery(keyword);
    // 검색어를 설정하면 디바운스 효과로 인해 자동으로 검색이 실행됨
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: true, headerTitle: 'Search' }} />
      {/* Search Input */}
      <View className="border-b border-gray-100 p-4">
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="ml-2 flex-1 text-base"
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Recent Searches */}
        <View className="border-b border-gray-100 p-4">
          <Text className="mb-3 text-lg font-bold">RECENT SEARCHES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {recentSearches.map((search) => (
                <TouchableOpacity
                  key={search.timestamp}
                  onPress={() => handleSearchClick(search.keyword)}
                  className="mr-3 flex-row items-center rounded-full bg-gray-100 px-4 py-2">
                  <Text>{search.keyword}</Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation(); // 버블링 방지
                      removeSearch(search.keyword);
                    }}
                    className="ml-2">
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recommended Categories */}
        <View className="border-b border-gray-100 p-4">
          <Text className="mb-3 text-lg font-bold">RECOMMENDED CATEGORIES</Text>
          <View className="flex-row flex-wrap">
            {recommendedCategories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                onPress={() => handleSearchClick(category.category_name)}
                className="mb-2 mr-2 rounded-full bg-gray-100 px-4 py-2">
                <Text>{category.category_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Searches */}
        <View className="p-4">
          <Text className="mb-3 text-lg font-bold">HOT KEYWORDS</Text>
          {sortedRanks.map((rank) =>
            rankGroups.get(rank)?.map((item, index) => (
              <TouchableOpacity
                key={`ranked-${item.keyword}-${item.checkTime}`}
                onPress={() => handleSearchClick(item.keyword)}
                className="mb-2 flex-row items-center justify-between py-2">
                <View className="mr-3 flex-row items-center">
                  <Text className="mr-5 w-5 font-bold text-gray-500">
                    {index === 0 ? rank.toString() : '-'}
                  </Text>
                  <Text>{item.keyword}</Text>
                </View>
                {getTrendIcon(item.rankChange, Math.abs(item.rankDifference || 0))}
              </TouchableOpacity>
            ))
          )}

          {unrankedSearches.map((item) => (
            <TouchableOpacity
              key={`unranked-${item.keyword}-${item.checkTime}`}
              onPress={() => handleSearchClick(item.keyword)}
              className="mb-2 flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Text className="mr-3 w-4 font-bold text-gray-500">-</Text>
                <Text>{item.keyword}</Text>
              </View>
              {getTrendIcon(item.rankChange, Math.abs(item.rankDifference || 0))}
            </TouchableOpacity>
          ))}
        </View>
        <View className="mt-5 h-16" />
      </ScrollView>
    </SafeAreaView>
  );
}
