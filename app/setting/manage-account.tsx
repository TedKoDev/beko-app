import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import { useDeactivateUser } from '~/queries/hooks/auth/useDeactivateUser';
import { useAuthStore } from '~/store/authStore';

export default function ManageAccount() {
  const { userInfo } = useAuthStore();
  const { mutate: deactivateUser, isPending } = useDeactivateUser();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { logout } = useAuthStore();
  const handleDeactivate = async () => {
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    try {
      deactivateUser(
        { userId: userInfo!.user_id, password },
        {
          onSuccess: () => {
            setShowModal(false);
            alert('Account has been successfully withdrawn.');
            //토큰 제거
            logout();
            router.replace('/login');
          },
          onError: (error: any) => {
            setError(error.message || 'Password does not match.');
          },
        }
      );
    } catch (error: any) {
      setError(error.message || 'An error occurred while withdrawing the account.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'User Info',
          headerShadowVisible: true,
        }}
      />

      <View className="flex-1">
        {/* 개인정보 섹션 */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-4 py-2">
            <Text className="text-lg font-bold">User Info</Text>
            <TouchableOpacity onPress={() => router.push('/setting/edit-profile')}>
              <Text className="text-sm text-gray-500 underline">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="mx-4 rounded-lg border border-gray-200 bg-white">
            <View className="border-b border-gray-100 px-4 py-3">
              <Text className="mb-1 text-sm text-gray-500">Email</Text>
              <Text className="text-base">{userInfo?.email}</Text>
            </View>
            <View className="border-b border-gray-100 px-4 py-3">
              <Text className="mb-1 text-sm text-gray-500">Nickname</Text>
              <Text className="text-base">{userInfo?.username}</Text>
            </View>
          </View>
        </View>

        {/* 간편 로그인 정보 */}
        <View className="mb-6">
          <Text className="px-4 py-2 text-lg font-bold">Social Login Info</Text>
          <View className="mx-4 rounded-lg border border-gray-200 bg-white">
            {userInfo?.social_login?.map((social, index) => (
              <View
                key={social.provider_user_id}
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
            {userInfo?.social_login?.length === 0 && (
              <Text className="text-sm text-gray-500">No social login info</Text>
            )}
          </View>
        </View>

        {/* 계정 탈퇴 */}
        <View>
          <TouchableOpacity
            className="mx-4"
            onPress={() => {
              setShowModal(true);
              setError('');
              setPassword('');
            }}>
            <Text className="text-base text-red-500">Account Withdrawal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 비밀번호 확인 모달 */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="m-5 w-[90%] rounded-lg bg-white p-4">
            <Text className="mb-4 text-center text-lg font-bold">Account Withdrawal</Text>
            {/* socail login 인 경우 비밀번호 입력 안함 */}
            {userInfo?.social_login?.length === 0 ? (
              <Text className="mb-4 text-center text-gray-600">
                Please enter your password to withdraw your account.{'\n'}
                After withdrawal, it cannot be recovered.
              </Text>
            ) : (
              <Text className="mb-4 text-center text-gray-600">
                Are you sure you want to delete your social login account?
              </Text>
            )}

            {userInfo?.social_login?.length === 0 && (
              <TextInput
                className="mb-4 h-12 rounded-lg border border-gray-300 px-4"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
              />
            )}
            {error ? <Text className="mb-4 text-center text-red-500">{error}</Text> : null}
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                className="rounded-lg border border-gray-300 px-4 py-2"
                onPress={() => {
                  setShowModal(false);
                  setError('');
                  setPassword('');
                }}
                disabled={isPending}>
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="ml-6 rounded-lg bg-red-500 px-4  py-2"
                onPress={handleDeactivate}
                disabled={isPending}>
                {isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white">Withdraw</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
