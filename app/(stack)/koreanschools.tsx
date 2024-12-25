import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
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
  Modal,
  Pressable,
  TextInput,
} from 'react-native';

import { useGetSchools } from '~/queries/hooks/schools/useSchools';
import { AdBanner } from '~/src/components/ads/AdBanner';
import { useCountryStore } from '~/store/countryStore';
import { School } from '~/types/school';

export default function KoreanSchoolsScreen() {
  const [selectedCountry, setSelectedCountry] = useState({
    country_id: 43, // Global의 ID
    country_code: 'KR',
    country_name: 'Korea',
    flag_icon: '🇰🇷',
    user_count: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useGetSchools({
      country_code: selectedCountry.country_code,
    });

  const { countries } = useCountryStore();

  const handleOpenWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const filteredCountries = (countries || []).filter((country) =>
    country.country_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: School }) => (
    <View className="mb-4 rounded-2xl bg-white p-5 shadow-sm">
      <View className="mb-1 flex-row items-center">
        <View className="mr-2 h-2 w-2 rounded-full bg-purple-custom" />
        <Text className="text-xs font-medium text-purple-custom">{item.country_code}</Text>
      </View>
      <Text className="mb-1 text-lg font-bold text-gray-800">{item.name_ko}</Text>
      <Text className="mb-4 text-sm text-gray-500">{item.name_en}</Text>
      {item.website_url && (
        <TouchableOpacity
          className="flex-row items-center self-start bg-violet-50 px-4 py-2"
          onPress={() => handleOpenWebsite(item.website_url)}>
          <Feather name="globe" size={16} color="purple-custom" />
          <Text className="ml-2 text-sm font-medium text-purple-custom">Visit Website</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#purple-custom" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AdBanner />
      {/* 국가 선택 버튼 */}
      <TouchableOpacity
        className="h-[50px] w-full flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-4"
        onPress={() => setShowCountryModal(true)}>
        <Text className="text-base text-gray-800">
          {selectedCountry.flag_icon} {selectedCountry.country_name}
        </Text>
        <Ionicons name="chevron-down" size={24} color="#666" />
      </TouchableOpacity>

      <Stack.Screen
        options={{
          title: 'Korean Schools Info',
          headerTitleAlign: 'center',
          headerShadowVisible: true,
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerRight: () => null,
        }}
      />

      {/* 학교 리스트 */}
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
          isFetchingNextPage ? <ActivityIndicator className="py-4" color="purple-custom" /> : null
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

      {/* 국가 선택 모달 */}
      <Modal visible={showCountryModal} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[80%] rounded-t-3xl bg-white px-5 pb-5">
            <View className="flex-row items-center justify-between border-b border-gray-100 py-4">
              <Text className="text-lg font-semibold text-gray-800">Select Country</Text>
              <Pressable onPress={() => setShowCountryModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            <TextInput
              className="my-2.5 h-10 rounded-lg bg-gray-100 px-4"
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.country_code}
              renderItem={({ item }: { item: any }) => (
                <Pressable
                  className="border-b border-gray-100 py-3"
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}>
                  <Text className="text-base text-gray-800">
                    {item.flag_icon} {item.country_name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
