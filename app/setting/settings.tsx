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
import { useAuthStore } from '~/store/authStore';
import { useDeactivateUser } from '~/queries/hooks/auth/useDeactivateUser';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Stack } from 'expo-router';

export default function Settings() {
  const { logout, userInfo } = useAuthStore();
  const deactivateUserMutation = useDeactivateUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');

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
      logout(); // 로그아웃 처리
      setModalVisible(false); // 모달 닫기
    } catch (error) {
      console.error('Error deactivating user:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white ">
      <Stack.Screen options={{ headerShown: true, headerTitle: 'Settings' }} />

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
        <TouchableOpacity className="flex-row items-center py-3" onPress={logout}>
          <FontAwesome5 name="sign-out-alt" size={24} color="#FF0000" />
          <Text className="ml-3 text-base text-red-500">Logout</Text>
        </TouchableOpacity>

        {/* 비밀번호 입력 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="w-80 rounded-lg bg-white p-4">
              <Text className="mb-4 text-lg font-bold">Confirm Deactivation</Text>
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="mb-4 rounded-lg border border-gray-300 p-2"
              />
              <Button title="Deactivate" onPress={handleDeactivateUser} color="#FF0000" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#007BFF" />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
