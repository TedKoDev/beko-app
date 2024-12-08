import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { useDeactivateUser } from '~/queries/hooks/auth/useDeactivateUser';
import { useAuthStore } from '~/store/authStore';

export default function Settings() {
  const { logout, userInfo } = useAuthStore();
  const deactivateUserMutation = useDeactivateUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogout = async () => {
    router.dismissAll();
    await logout();
    router.push('/(auth)/login');
  };

  const handleDeactivateUser = async () => {
    try {
      const userId = userInfo?.user_id; // 현재 사용자 ID 가져오기

      if (!userId) {
        Alert.alert('Error', 'User ID is not available.');
        return;
      }

      console.log('handleDeactivateUser', userId, password);

      await deactivateUserMutation.mutateAsync({ userId, password });
      Alert.alert('Success', 'Your account has been deactivated.');
      await logout();
      router.reset({
        index: 0,
        routes: [{ name: '/(auth)/login' }],
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      {/* <Stack.Screen options={{ headerShown: true, headerTitle: 'Settings' }} /> */}

      <View className="p-4">
        <Text className="mb-4 text-lg font-bold">Settings</Text>

        {/* 회원 탈퇴 버튼 */}
        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="user-slash" size={24} color="#FF0000" />
          <Text className="ml-3 text-base text-red-500">Deactivate Account</Text>
        </TouchableOpacity>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity className="flex-row items-center py-3" onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={24} color="#FF0000" />
          <Text className="ml-3 text-base text-red-500">Logout</Text>
        </TouchableOpacity>

        {/* 비밀번호 입력 모달 */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            className="flex-1 items-center justify-center bg-black/50">
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              className="w-80 rounded-lg bg-white p-6">
              <Text className="mb-6 text-center text-xl font-bold">Confirm Deactivation</Text>
              <Text className="mb-4 text-center text-gray-600">
                Please enter your password to deactivate your account
              </Text>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="mb-6 rounded-lg border border-gray-300 p-3"
              />
              <View className="flex-row justify-between gap-3">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="rounded-lg bg-gray-200 px-6 py-3">
                  <Text className="font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeactivateUser}
                  disabled={!password}
                  className={`rounded-lg px-6 py-3 ${password ? 'bg-red-500' : 'bg-red-300'}`}>
                  <Text className="font-semibold text-white">Deactivate</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
