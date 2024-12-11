import { Stack, router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useAuthStore } from '~/store/authStore';

export default function Settings() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1">
        {/* 계정 섹션 */}
        <View className="mb-6">
          <Text className="px-4 py-2 text-lg font-bold text-black">Account</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={() => router.push('/setting/manage-account')}>
            <Text className="text-base">Manage Account</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          {/* <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-3">
            <Text className="text-base">Blocked Users</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity> */}
          <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-3">
            <Text className="text-base">Reset Password</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* 서비스 섹션 */}
        <View className="mb-6">
          <Text className="px-4 py-2 text-lg font-bold text-black">Service</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={() => router.push('/setting/notification-settings')}>
            <Text className="text-base">Notification Settings</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-3">
            <Text className="text-base">Terms of Service</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between bg-white px-4 py-3">
            <Text className="text-base">Privacy Policy</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* 기타 섹션 */}
        <View>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={handleLogout}>
            <Text className="text-base">Logout</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
