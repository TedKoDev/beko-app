import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import { useUpdateProfile } from '~/queries/hooks/auth/useUpdateProfile';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';
import { useAuthStore } from '~/store/authStore';

export default function EditProfileImage() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const updateProfileMutation = useUpdateProfile();
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      setIsLoading(true);
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

        const { url } = await getPresignedUrlApi(fileName, image.type || 'image/jpeg');
        const response = await fetch(image.uri);
        const blob = await response.blob();
        await uploadFileToS3(url, blob);

        const imageUrl = url.split('?')[0];

        await updateProfileMutation.mutateAsync({
          userId: userInfo?.user_id ?? 0,
          username: userInfo?.username ?? '',
          bio: userInfo?.bio ?? '',
          country_id: Number(userInfo?.country?.country_id),
          terms_agreed: userInfo?.terms_agreed,
          privacy_agreed: userInfo?.privacy_agreed,
          marketing_agreed: userInfo?.marketing_agreed,
          profile_picture_url: imageUrl, // 이미지 URL 추가
        });

        Alert.alert('Success', 'Profile image updated successfully');
        router.back();
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Error', 'Failed to update profile image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'Edit Profile Image',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1 items-center justify-center p-4">
        <View className="relative mb-8">
          <Image
            source={{
              uri: userInfo?.profile_picture_url || 'https://via.placeholder.com/200',
            }}
            className="h-40 w-40 rounded-full"
          />
          <TouchableOpacity
            className="absolute bottom-0 right-0 rounded-full bg-[#6C47FF] p-3"
            onPress={pickImage}
            disabled={isLoading}>
            <Feather name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/30">
            <ActivityIndicator size="large" color="#6C47FF" />
          </View>
        )}

        <Text className="text-center text-gray-500">
          Tap the camera icon to change your profile picture
        </Text>
      </View>
    </SafeAreaView>
  );
}
