import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import GrayLine from '~/components/grayline';
import { logoutApi } from '~/services/authService';

import { useAuthStore } from '~/store/authStore';

export default function Settings() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      console.log('logout', token);
      await logoutApi(token);
    }
    console.log('logout333');
    logout();
    console.log('logout444');
    router.dismissAll();
    router.replace('/(auth)/login');
    console.log('logout555');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerShadowVisible: true,
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
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={() => router.push('/setting/reset-password')}>
            <Text className="text-base">Reset Password</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        <GrayLine thickness={1} marginTop={0} marginBottom={10} />

        {/* 서비스 섹션 */}
        <View className="mb-6">
          <Text className="px-4 py-2 text-lg font-bold text-black">Service</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={() => router.push('/setting/notification-settings')}>
            <Text className="text-base">Notification Settings</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={() => router.push('/terms/terms')}>
            <Text className="text-base">Terms of Service</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-white px-4 py-3"
            onPress={() => router.push('/terms/privacy')}>
            <Text className="text-base">Privacy Policy</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#999" />
          </TouchableOpacity>
        </View>
        <GrayLine thickness={1} marginTop={0} marginBottom={10} />
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
