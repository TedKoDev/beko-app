import { router, Stack } from 'expo-router';
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import { useAuthStore } from '~/store/authStore';

export default function ManageAccount() {
  const { userInfo } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: '회원정보 관리',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1">
        {/* 개인정보 섹션 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-4 py-2">
            <Text className="text-lg font-bold">개인정보</Text>
            <TouchableOpacity onPress={() => router.push('/setting/edit-profile')}>
              <Text className="text-sm text-gray-500 underline">수정</Text>
            </TouchableOpacity>
          </View>
          <View className="mx-4 rounded-lg border border-gray-200 bg-white">
            <View className="border-b border-gray-100 px-4 py-3">
              <Text className="mb-1 text-sm text-gray-500">이메일</Text>
              <Text className="text-base">{userInfo?.email}</Text>
            </View>
            <View className="border-b border-gray-100 px-4 py-3">
              <Text className="mb-1 text-sm text-gray-500">닉네임</Text>
              <Text className="text-base">{userInfo?.username}</Text>
            </View>
          </View>
        </View>

        {/* 간편 로그인 정보 */}
        <View className="mb-6">
          <Text className="px-4 py-2 text-lg font-bold">간편 로그인 정보</Text>
          <View className="mx-4 rounded-lg border border-gray-200 bg-white">
            {userInfo?.social_login?.map((social, index) => (
              <View
                key={social.social_login_id}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  index !== userInfo.social_login.length - 1 ? 'border-b border-gray-100' : ''
                }`}>
                <View className="flex-row items-center">
                  {social.provider === 'NAVER' && (
                    <Text className="mr-2 text-base font-bold text-[#03C75A]">N</Text>
                  )}
                  {social.provider === 'GOOGLE' && (
                    <Text className="mr-2 text-base font-bold text-[BLUE]">GOOGLE</Text>
                  )}
                  {social.provider === 'APPLE' && (
                    <Text className="mr-2 text-base font-bold text-[BLACK]">APPLE</Text>
                  )}
                </View>
                <Text className="text-sm text-gray-500">{userInfo.email}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 계정 탈퇴 */}
        <View>
          <TouchableOpacity className="mx-4">
            <Text className="text-base text-red-500">계정 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
