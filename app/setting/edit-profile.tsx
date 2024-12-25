import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { debounce } from 'lodash';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useUpdateProfile } from '~/queries/hooks/auth/useUpdateProfile';
import { useAgreements } from '~/queries/hooks/notification/useNotification';
import { useCountry } from '~/queries/hooks/utils/useCountry';
import { authService } from '~/services/authService';
import { useAuthStore } from '~/store/authStore';

export default function EditProfile() {
  const { userInfo } = useAuthStore();
  const { data: countries } = useCountry();
  const { isUpdating } = useAgreements();

  const updateProfileMutation = useUpdateProfile();
  const isSocialLogin = userInfo?.social_login && userInfo.social_login.length > 0;

  const [formData, setFormData] = useState({
    email: userInfo?.email || '',
    name: userInfo?.username || '',
    bio: userInfo?.bio || '',
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

  const [agreements, setAgreements] = useState({
    terms: userInfo?.terms_agreed || false,
    privacy: userInfo?.privacy_agreed || false,
    marketing: userInfo?.marketing_agreed || false,
  });

  const [isNameValid, setIsNameValid] = useState(true);
  const [nameError, setNameError] = useState<string>('');
  const [isCheckingName, setIsCheckingName] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setAgreements({
        terms: userInfo.terms_agreed,
        privacy: userInfo.privacy_agreed,
        marketing: userInfo.marketing_agreed,
      });
    }
  }, [userInfo]);

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const checkName = debounce(async (name: string) => {
    if (!name) {
      setNameError('');
      setIsNameValid(false);
      return;
    }

    if (name === userInfo?.username) {
      setIsNameValid(true);
      setNameError('');
      return;
    }

    setIsCheckingName(true);
    try {
      const available = await authService.checkName(name);
      setIsNameValid(available);
      setNameError(available ? '' : 'This name is already taken.');
    } catch (error) {
      if (error instanceof Error) {
        setNameError(error.message);
      } else {
        setNameError('Failed to check name availability.');
      }
      setIsNameValid(false);
    } finally {
      setIsCheckingName(false);
    }
  }, 500);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a name.');
      return;
    }

    if (!isNameValid) {
      alert('This name is not available.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        userId: userInfo?.user_id ?? 0,
        username: formData.name.trim(),
        bio: formData.bio.trim(),
        country_id: Number(selectedCountry.country_id),
        terms_agreed: agreements.terms,
        privacy_agreed: agreements.privacy,
        marketing_agreed: agreements.marketing,
      });

      alert('Profile updated successfully');
      router.back();
    } catch (error: any) {
      alert(error.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'Edit Profile',
          headerShadowVisible: true,
        }}
      />

      <View className="flex-1">
        {/* 입력 필드들 */}
        <View className="space-y-5 p-4">
          <View className="mb-4">
            <Text className="mb-2 text-sm">Email {isSocialLogin ? '(Social Login)' : ''}</Text>
            <TextInput
              className={`h-12 rounded-lg border border-gray-200 px-4 ${isSocialLogin ? 'bg-gray-300' : 'bg-gray-300'}`}
              value={formData.email}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
              editable={false}
              placeholder={
                isSocialLogin
                  ? 'Social Login account cannot be modified'
                  : 'Please enter your email'
              }
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm">Name</Text>
            <TextInput
              className={`mb-4 h-[50px] w-full rounded-lg border px-4 ${
                nameError ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Nickname"
              value={formData.name}
              onChangeText={(text) => {
                setFormData((prev) => ({ ...prev, name: text }));
                checkName(text);
              }}
            />
            {nameError ? (
              <Text className="-mt-2 mb-2 text-xs text-red-500">{nameError}</Text>
            ) : isNameValid && formData.name ? (
              <Text className="-mt-2 mb-2 text-xs text-green-600">
                {isCheckingName ? 'Checking...' : 'This name is available!'}
              </Text>
            ) : null}
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm">Bio</Text>
            <TextInput
              className="h-24 rounded-lg border border-gray-200 px-4 py-2"
              value={formData.bio}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))}
              multiline
              placeholder="Enter your bio"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm">Country</Text>
            <TouchableOpacity
              className="h-12 flex-row items-center justify-between rounded-lg border border-gray-200 px-4"
              onPress={() => setShowCountryModal(true)}>
              <Text>
                {selectedCountry.flag_icon} {selectedCountry.country_name}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 구분선 */}
        <View className="h-[1px] w-full bg-gray-100" />

        {/* 약관 동의 섹션 */}
        <View className="p-4">
          <Text className="mb-4 text-sm">Terms and Marketing Agreement</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() => {
              if (agreements.terms) {
                Alert.alert('Required', 'BeraKorean Terms is required.', [
                  // { text: '확인' },
                ]);
              } else {
                toggleAgreement('terms');
              }
            }}>
            <View className="flex-row items-center">
              <AntDesign
                name={agreements.terms ? 'checkcircle' : 'checkcircleo'}
                size={20}
                color={agreements.terms ? '#7b33ff' : '#DDD'}
              />
              <Text className="ml-2 text-base">Agree to Berakorean Terms (Required)</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/terms/terms')} className="p-2">
              <AntDesign name="right" size={16} color="#999" />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() => {
              if (agreements.privacy) {
                Alert.alert('Required', 'Privacy Policy is required.', [
                  // { text: '확인' },
                ]);
              } else {
                // toggleAgreement('privacy');
              }
            }}>
            <View className="flex-row items-center">
              <AntDesign
                name={agreements.privacy ? 'checkcircle' : 'checkcircleo'}
                size={20}
                color={agreements.privacy ? '#7b33ff' : '#DDD'}
              />
              <Text className="ml-2 text-base">Privacy Policy (Required)</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/terms/privacy')} className="p-2">
              <AntDesign name="right" size={16} color="#999" />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() => toggleAgreement('marketing')}>
            <View className="flex-row items-center">
              <AntDesign
                name={agreements.marketing ? 'checkcircle' : 'checkcircleo'}
                size={20}
                color={agreements.marketing ? '#7b33ff' : '#DDD'}
              />
              <Text className="ml-2 text-base">
                Agree to receive marketing information {'\n'}
                (Optional)
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/terms/marketing')} className="p-2">
              <AntDesign name="right" size={16} color="#999" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* 수정 완료 버튼 */}
        <View className="p-4">
          <TouchableOpacity
            className={`h-12 items-center justify-center rounded-lg ${
              !isUpdating ? 'bg-[#7b33ff]' : 'bg-gray-200'
            }`}
            onPress={handleSubmit}
            disabled={isUpdating}>
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base text-white">Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 국가 선택 모달 */}
      <Modal visible={showCountryModal} animationType="slide">
        <View className="flex-1 bg-white">
          <SafeAreaView className="h-3/4 flex-1">
            <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
              <View className="flex-1 flex-row items-center">
                <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="ml-4 text-lg">Country Selection</Text>
              </View>
              <TouchableOpacity onPress={() => setShowCountryModal(false)}>
                <Text className="text-gray-400">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="px-4 py-2">
              <View className="flex-row items-center rounded-lg bg-gray-100 px-4 py-2">
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  className="ml-2 flex-1"
                  placeholder="Search Country..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <FlatList
              data={countries?.filter((country: any) =>
                country.country_name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              keyExtractor={(item) => item.country_code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center border-b border-gray-100 px-4 py-3"
                  onPress={() => {
                    setSelectedCountry(item);
                    setShowCountryModal(false);
                  }}>
                  <Text className="text-base">
                    {item.flag_icon} {item.country_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
