import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import GrayLine from '../grayline';

import { ConsultationStatus, getStatusText } from '~/types/consultation';
import { Topic } from '~/services/postService';

interface ConsultationFilterHeaderProps {
  selectedStatus: ConsultationStatus | undefined;
  selectedSort: 'latest' | 'oldest';
  selectedCategoryId?: number;
  showSortModal: boolean;
  setSelectedStatus: (status: ConsultationStatus | undefined) => void;
  setSelectedSort: (sort: 'latest' | 'oldest') => void;
  setSelectedCategoryId: (id: number | undefined) => void;
  setShowSortModal: (show: boolean) => void;
  topicsData?: Topic[];
}

export const ConsultationFilterHeader: React.FC<ConsultationFilterHeaderProps> = ({
  selectedStatus,
  selectedSort,
  selectedCategoryId,
  showSortModal,
  setSelectedStatus,
  setSelectedSort,
  setSelectedCategoryId,
  setShowSortModal,
  topicsData,
}) => {
  // 토픽 1번(상담)의 카테고리들
  const consultationCategories = topicsData?.find((topic) => topic.topic_id === 1)?.category ?? [];

  return (
    <View className="bg-white ">
      {/* 상담 상태 필터 */}
      <View className="bg-white py-4">
        <Text className="mb-2 pl-4 text-gray-600">Consultation Status</Text>
        <ScrollView className="pl-4" horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedStatus(undefined)}
              className={`rounded-full px-4 py-2 ${
                selectedStatus === undefined ? 'bg-purple-500' : 'bg-gray-200'
              }`}>
              <Text className={selectedStatus === undefined ? 'text-white' : 'text-gray-700'}>
                All
              </Text>
            </TouchableOpacity>
            {Object.values(ConsultationStatus).map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                className={`rounded-full px-4 py-2 ${
                  selectedStatus === status ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                <Text className={selectedStatus === status ? 'text-white' : 'text-gray-700'}>
                  {getStatusText(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 카테고리 필터 */}
      <View className="mt-4">
        <Text className="mb-2 pl-4 text-gray-600">Consultation Type</Text>
        <ScrollView className="pl-4" horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedCategoryId(undefined)}
              className={`rounded-full px-4 py-2 ${
                selectedCategoryId === undefined ? 'bg-purple-500' : 'bg-gray-200'
              }`}>
              <Text className={selectedCategoryId === undefined ? 'text-white' : 'text-gray-700'}>
                All
              </Text>
            </TouchableOpacity>
            {consultationCategories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                onPress={() => setSelectedCategoryId(category.category_id)}
                className={`rounded-full px-4 py-2 ${
                  selectedCategoryId === category.category_id ? 'bg-purple-500' : 'bg-gray-200'
                }`}>
                <Text
                  className={
                    selectedCategoryId === category.category_id ? 'text-white' : 'text-gray-700'
                  }>
                  {category.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 정렬 옵션 */}
      <View className="flex-row justify-end">
        <View className="mx-4 mb-2 mt-4">
          <TouchableOpacity
            onPress={() => setShowSortModal(!showSortModal)}
            className="flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-2">
            <Text className="text-gray-700">{selectedSort === 'latest' ? 'Latest' : 'Oldest'}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <GrayLine thickness={1} marginTop={10} />
    </View>
  );
};
