import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { FilterHeader } from '~/components/feed/FilterHeader';
import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';
import { useTopics } from '~/queries/hooks/posts/useTopicsAndCategories';

export default function Feed() {
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'popular'>('latest');
  const [selectedTopicId, setSelectedTopicId] = useState<number | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [showSortModal, setShowSortModal] = useState(false);
  const [showQuestionsOnly, setShowQuestionsOnly] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(200);

  const { data: topicsData } = useTopics();

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 15,
    sort: sortBy,
    topicId: selectedTopicId,
    categoryId: selectedCategoryId,
    type: showQuestionsOnly ? 'QUESTION' : undefined,
  });

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];
  const selectedTopic = topicsData?.find((topic) => topic.topic_id === selectedTopicId);

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Popular' },
  ] as const;

  useEffect(() => {
    if (selectedTopic?.category?.length) {
      setDropdownPosition(200);
    } else {
      setDropdownPosition(130);
    }
  }, [selectedTopic]);

  useEffect(() => {
    refetch();
  }, [selectedTopicId, selectedCategoryId, sortBy, showQuestionsOnly]);

  return (
    <View className="flex-1 bg-white">
      <View style={{ flex: 1 }}>
        <ListLayout
          headerTitle="Community"
          data={allPosts}
          showViewToggle
          showWriteButton
          showSearchButton
          hideButton
          isLoading={isFetchingNextPage}
          onLoadMore={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-gray-500">There is no post</Text>
            </View>
          }
          onRefresh={refetch}
          isRefreshing={isRefetching}
          ListHeaderComponent={
            <FilterHeader
              selectedTopicId={selectedTopicId}
              selectedCategoryId={selectedCategoryId}
              topicsData={topicsData as any}
              selectedTopic={selectedTopic as any}
              showSortModal={showSortModal}
              selectedSortLabel={
                sortOptions.find((option) => option.value === sortBy)?.label ?? 'Latest'
              }
              setSelectedTopicId={setSelectedTopicId}
              setSelectedCategoryId={setSelectedCategoryId}
              setShowSortModal={setShowSortModal}
              showQuestionsOnly={showQuestionsOnly}
              setShowQuestionsOnly={setShowQuestionsOnly}
            />
          }
          contentContainerStyle={{
            paddingTop: 0,
          }}
        />
      </View>
      {showSortModal && (
        <View
          style={{
            position: 'absolute',
            right: 16,
            top: dropdownPosition,
            width: 128,
            backgroundColor: 'white',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            zIndex: 9999,
          }}>
          {sortOptions.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              onPress={() => {
                setSortBy(value);
                setShowSortModal(false);
              }}
              className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
              <Text className="text-gray-700">{label}</Text>
              {sortBy === value && <Ionicons name="checkmark" size={20} color="#7b33ff" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
