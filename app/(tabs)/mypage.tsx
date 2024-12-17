import { Feather, FontAwesome } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Alert, Image, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

import { LevelProgressBar } from '~/components/level/LevelProgressBar';
import { useUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { AdBanner } from '~/src/components/ads/AdBanner';
import { useAuthStore } from '~/store/authStore';

export default function MyPage() {
  const router = useRouter();

  const userInfo = useAuthStore((state) => state.userInfo);

  // const { data: userInfodd, isLoading } = useUserInfo();
  // console.log('userInfodd', JSON.stringify(userInfodd, null, 2));
  // console.log('userInfo from store', JSON.stringify(userInfo, null, 2));

  const handleSettings = () => {
    router.push('/setting/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'My Page' }} />
      <ScrollView
        className="m-4 flex-1 "
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-4">
          {/* Profile Section */}
          <View className="mb-4 flex-row items-center">
            <View className="relative mr-3">
              {userInfo?.profile_picture_url ? (
                <Image
                  source={{ uri: userInfo?.profile_picture_url }}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <FontAwesome name="user-circle" size={80} color="#B227D4" />
              )}
              <TouchableOpacity
                className="absolute right-0 top-0 rounded-full bg-white p-1 shadow-md"
                onPress={() => router.push('/(stack)/edit-profile-image')}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Feather name="edit-2" size={16} color="#6C47FF" />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold">{userInfo?.username || 'Student'}</Text>
              <View className="flex-row items-center">
                <Text>{userInfo?.country?.flag_icon || '🌏'}</Text>
              </View>
              <Text className="text-xs text-gray-500">{userInfo?.email}</Text>
            </View>
          </View>
          {/* Level Progress Section */}
          <View className="mb-4">
            <LevelProgressBar />
          </View>
          {/* Points Section */}
          <TouchableOpacity
            className="mb-4 flex-row justify-between rounded-xl bg-blue-100 p-4"
            style={{
              shadowColor: '#000', // 그림자 색상
              shadowOffset: { width: 2, height: 2 }, // x, y 값으로 그림자 방향 설정
              shadowOpacity: 0.3, // 그림자 투명도
              shadowRadius: 1, // 그림자 퍼짐 정도
              elevation: 5, // Android에서의 그림자 강도
            }}
            onPress={() => router.push('/(stack)/pointhistory')}>
            <Text className="text-base">🎯 Learning Points</Text>
            <Text className="text-base font-bold">{userInfo?.points || 0} pts</Text>
          </TouchableOpacity>
          {/* Activity Section */}
          <View
            className="mb-4 flex-row justify-around rounded-xl bg-gray-100 p-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 1,
              elevation: 5,
            }}>
            <TouchableOpacity
              className="items-center"
              onPress={() => router.push('/(stack)/my-posts')}>
              <Text className="mb-1 text-lg font-bold">{userInfo?.stats?.postCount || 0}</Text>
              <Text className="text-xs text-gray-500">Posts</Text>
            </TouchableOpacity>
            <View className="h-full w-px bg-gray-300" />
            <TouchableOpacity
              className="items-center"
              onPress={() => router.push('/(stack)/my-comments')}>
              <Text className="mb-1 text-lg font-bold">{userInfo?.stats?.commentCount || 0}</Text>
              <Text className="text-xs text-gray-500">Comments</Text>
            </TouchableOpacity>
          </View>
          {/* Learning Section */}
          <View className="mb-4">
            <AdBanner />
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => router.push('/consultations')}>
              <Feather name="message-square" size={24} color="#9333ea" />
              <Text className="ml-3 text-base">My Consultation History</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className="flex-row items-center py-3">
              <FontAwesome5 name="book" size={24} color="black" />
              <Text className="ml-3 text-base">My Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-3">
              <FontAwesome5 name="history" size={24} color="black" />
              <Text className="ml-3 text-base">Learning History</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-3">
              <FontAwesome5 name="bookmark" size={24} color="black" />
              <Text className="ml-3 text-base">Bookmarks</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => router.push('/board/notice')}>
              <Feather name="bell" size={24} color="#9333ea" />
              <Text className="ml-3 text-base">Announcements</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => router.push('/(stack)/support')}>
              <Feather name="help-circle" size={24} color="#9333ea" />
              <Text className="ml-3 text-base">Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
              <Feather name="user-plus" size={24} color="#9333ea" />
              <Text className="ml-3 text-base">Become a Teacher</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-3" onPress={handleSettings}>
              <Feather name="settings" size={24} color="#9333ea" />
              <Text className="ml-3 text-base">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
