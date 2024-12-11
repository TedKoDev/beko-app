import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';

import { updatePasswordApi } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { userInfo } = useAuthStore();
  console.log('userInfo', userInfo);

  // 소셜 로그인 사용자인지 확인
  const isSocialUser = userInfo?.social_login && userInfo.social_login.length > 0;

  const handleResetPassword = async () => {
    try {
      // 기본적인 유효성 검사
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // 비밀번호 유효성 검사를 위한 정규식
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        Alert.alert(
          'Error',
          'Password must be at least 8 characters long and contain:\n\n' +
            '• At least one uppercase letter\n' +
            '• At least one lowercase letter\n' +
            '• At least one number\n' +
            '• At least one special character (@$!%*?&)'
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }

      const response = await updatePasswordApi(currentPassword, newPassword);

      // 에러 메시지가 있는 경우 에러로 처리
      if (response.message && response.message !== '비밀번호가 성공적으로 변경되었습니다') {
        Alert.alert('Error', response.message);
        return;
      }

      // 성공한 경우에만 성공 메시지 표시
      Alert.alert('Success', 'Password has been updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            // 입력 필드 초기화
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          },
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update password';
      Alert.alert('Error', errorMessage);
    }
  };

  if (isSocialUser) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Reset Password',
            headerShadowVisible: false,
          }}
        />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-lg text-gray-600">
            Password reset is not available for social login accounts.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Reset Password',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1 px-4 pt-6">
        <View className="space-y-4">
          <View>
            <Text className="mb-2 text-sm text-gray-600">Current Password</Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm text-gray-600">New Password</Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
            />
            <Text className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters long and contain uppercase, lowercase, number,
              and special character
            </Text>
          </View>

          <View>
            <Text className="mb-2 text-sm text-gray-600">Confirm New Password</Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-3"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
            />
          </View>

          <TouchableOpacity
            className="mt-6 rounded-lg bg-blue-500 py-4"
            onPress={handleResetPassword}>
            <Text className="text-center font-semibold text-white">Update Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
