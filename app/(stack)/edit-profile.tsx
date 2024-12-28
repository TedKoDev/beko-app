import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useUpdateProfile } from '~/queries/hooks/auth/useUpdateProfile';
import { useCountry } from '~/queries/hooks/utils/useCountry';
import { getPresignedUrlApi, uploadFileToS3 } from '~/services/s3Service';
import { useAuthStore } from '~/store/authStore';

export default function EditProfileScreen() {
  // 사용안함.
  const router = useRouter();
  const userInfo = useAuthStore((state) => state.userInfo);
  const updateProfileMutation = useUpdateProfile({
    userId: userInfo?.user_id,
    username: userInfo?.username || '',
    bio: userInfo?.bio || '',
    country_id: userInfo?.country?.country_id || 1,
    terms_agreed: userInfo?.terms_agreed || false,
    privacy_agreed: userInfo?.privacy_agreed || false,
    marketing_agreed: userInfo?.marketing_agreed || false,
  });
  const { data: countries } = useCountry();

  const [editedProfile, setEditedProfile] = useState({
    username: userInfo?.username || '',
    bio: userInfo?.bio || '',
    profile_picture_url: userInfo?.profile_picture_url || '',
    country_id: userInfo?.country?.country_id || 1,
  });

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(
    userInfo?.country || {
      country_id: 1,
      country_name: 'Global',
      flag_icon: '🌎',
    }
  );

  // Country 검색 필터링
  const filteredCountries = countries?.filter((country) =>
    country.country_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        userId: userInfo?.user_id,
        ...editedProfile,
        country_id: selectedCountry.country_id,
      });
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          // headerLeft: () => (
          //   <TouchableOpacity className="p-2" onPress={() => router.back()}>
          //     <Ionicons name="close" size={24} color="#000" />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity className="p-2" onPress={handleSave}>
              <Text className="font-semibold text-blue-500">Save</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView>
        {/* Profile Image Section */}
        <View className="items-center py-6">
          <Image
            source={{ uri: editedProfile.profile_picture_url || 'https://via.placeholder.com/100' }}
            className="h-24 w-24 rounded-full"
          />
          <Pressable className="mt-4 rounded-full bg-gray-100 px-4 py-2" onPress={pickImage}>
            <Text className="font-medium text-blue-500">Change Photo</Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View className="px-4">
          <View className="mb-4">
            <Text className="mb-1 text-gray-600">Username</Text>
            <TextInput
              className="rounded-lg border border-gray-300 bg-white p-3"
              value={editedProfile.username}
              onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, username: text }))}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 text-gray-600">Bio</Text>
            <TextInput
              className="h-24 rounded-lg border border-gray-300 bg-white p-3"
              value={editedProfile.bio}
              onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
              multiline
            />
          </View>

          <View className="mb-4">
            <Text className="mb-1 text-gray-600">Country</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white p-3"
              onPress={() => setShowCountryModal(true)}>
              <Text>
                {selectedCountry.flag_icon} {selectedCountry.country_name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Country Selection Modal */}
      <Modal visible={showCountryModal} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="h-3/4 rounded-t-xl bg-white">
            <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
              <Text className="text-lg font-semibold">Select Country</Text>
              <Pressable className="p-2" onPress={() => setShowCountryModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            <TextInput
              className="mx-4 my-2 rounded-lg bg-gray-100 p-3"
              placeholder="Search country..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.country_code}
              renderItem={({ item }) => (
                <Pressable
                  className="border-b border-gray-200 p-4"
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}>
                  <Text className="text-base">
                    {item.flag_icon} {item.country_name}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
