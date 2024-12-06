import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { LevelProgressBar } from '~/components/level/LevelProgressBar';
import { useUpdateProfile } from '~/queries/hooks/auth/useUpdateProfile';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';
import { useAuthStore } from '~/store/authStore';

export default function MyPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const userInfo = useAuthStore((state) => state.userInfo);
  const updateProfileMutation = useUpdateProfile();

  console.log('userInfo from store', JSON.stringify(userInfo, null, 2));

  const [modalVisible, setModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: '',
    bio: '',
    profile_picture_url: '',
  });

  useEffect(() => {
    if (userInfo) {
      setEditedProfile({
        username: userInfo.username || '',
        bio: userInfo.bio || '',
        profile_picture_url: userInfo.profile_picture_url || '',
      });
    }
  }, [userInfo]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Please grant camera roll permissions to change your profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const extension = image.uri.split('.').pop();
        const fileName = `profile-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;

        try {
          const { url } = await getPresignedUrlApi(fileName, image.type || 'image/jpeg');
          const response = await fetch(image.uri);
          const blob = await response.blob();
          await uploadFileToS3(url, blob);

          // S3에 업로드된 이미지 URL (서명 제거)
          const imageUrl = url.split('?')[0];

          setEditedProfile((prev) => ({
            ...prev,
            profile_picture_url: imageUrl,
          }));
        } catch (error) {
          console.error('Failed to upload image:', error);
          Alert.alert('Error', 'Failed to upload profile image');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!userInfo?.user_id) {
        throw new Error('User ID is not available');
      }

      const updateData = {
        userId: Number(userInfo.user_id),
        username: editedProfile.username.trim(),
        bio: editedProfile.bio?.trim() || '',
        profile_picture_url: editedProfile.profile_picture_url || '',
      };

      console.log('Updating profile with:', updateData);
      await updateProfileMutation.mutateAsync(updateData);
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.message || error.message || 'Failed to update profile';

      Alert.alert('Error', errorMessage);
    }
  };

  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 150) {
        runOnJS(setModalVisible)(false);
      }
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleEditProfile = () => {
    router.push('/(stack)/edit-profile');
  };

  const handleSettings = () => {
    router.push('/setting/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: 'My Page' }} />
      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-4">
          {/* Profile Section */}
          <View className="mb-4 flex-row items-center">
            <Image
              source={{
                uri: userInfo?.profile_picture_url || 'https://via.placeholder.com/100',
              }}
              className="mr-3 h-20 w-20 rounded-full"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold">{userInfo?.username || 'Student'}</Text>
              <View className="flex-row items-center">
                <Text>{userInfo?.country?.flag_icon || '🌏'}</Text>
              </View>
              <Text className="text-xs text-gray-500">{userInfo?.email}</Text>
            </View>
            <TouchableOpacity
              className="rounded-lg bg-gray-200 p-2 "
              style={{
                shadowColor: '#000', // 그림자 색상
                shadowOffset: { width: 2, height: 2 }, // x, y 값으로 그림자 방향 설정
                shadowOpacity: 0.3, // 그림자 투명도
                shadowRadius: 1, // 그림자 퍼짐 정도
                elevation: 5, // Android에서의 그림자 강도
              }}
              onPress={handleEditProfile}>
              <Text className="text-xs text-blue-500">Edit Profile</Text>
            </TouchableOpacity>
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
              shadowColor: '#000', // 그림자 색상
              shadowOffset: { width: 2, height: 2 }, // x, y 값으로 그림자 방향 설정
              shadowOpacity: 0.3, // 그림자 투명도
              shadowRadius: 1, // 그림자 퍼짐 정도
              elevation: 5, // Android에서의 그림자 강도
            }}>
            <View className="items-center">
              <Text className="mb-1 text-lg font-bold">{userInfo?.stats?.postCount || 0}</Text>
              <Text className="text-xs text-gray-500">Posts</Text>
            </View>
            <View className="items-center">
              <Text className="mb-1 text-lg font-bold">{userInfo?.stats?.commentCount || 0}</Text>
              <Text className="text-xs text-gray-500">Comments</Text>
            </View>
          </View>

          {/* Learning Section */}
          <View className="mb-4">
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => router.push('/consultations')}>
              <FontAwesome5 name="comments" size={24} color="black" />
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
              <FontAwesome5 name="bullhorn" size={24} color="black" />
              <Text className="ml-3 text-base">Announcements</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => router.push('/(stack)/support')}>
              <FontAwesome5 name="headset" size={24} color="black" />
              <Text className="ml-3 text-base">Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}>
              <FontAwesome5 name="user-plus" size={24} color="black" />
              <Text className="ml-3 text-base">Become a Teacher</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-3" onPress={handleSettings}>
              <FontAwesome5 name="cog" size={24} color="black" />
              <Text className="ml-3 text-base">Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <Button title="Logout" onPress={logout} color="#FF0000" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
