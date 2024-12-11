import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { useCountry } from '~/queries/hooks/utils/useCountry';
import { useAuthStore } from '~/store/authStore';

export default function EditProfile() {
  const { userInfo } = useAuthStore();
  const { data: countries } = useCountry();
  const isSocialLogin = userInfo?.social_login && userInfo.social_login.length > 0;

  const [formData, setFormData] = useState({
    email: userInfo?.email || '',
    name: userInfo?.username || '',
    birthDate: '1994-04-22',
    phone: '010-1234-5678',
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
    terms: false,
    privacy: false,
    marketing: false,
  });

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: '개인정보 수정',
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1">
        {/* 입력 필드들 */}
        <View className="space-y-5 p-4">
          <View className="mb-4">
            <Text className="mb-2 text-sm">이메일 {isSocialLogin ? '(소셜 로그인 계정)' : ''}</Text>
            <TextInput
              className={`h-12 rounded-lg border border-gray-200 px-4 ${isSocialLogin ? 'bg-gray-50' : ''}`}
              value={formData.email}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
              editable={!isSocialLogin}
              placeholder={
                isSocialLogin
                  ? '소셜 로그인 계정은 이메일을 수정할 수 없습니다'
                  : '이메일을 입력해주세요'
              }
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm">이름</Text>
            <TextInput
              className="h-12 rounded-lg border border-gray-200 px-4"
              value={formData.name}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm">자기소개</Text>
            <TextInput
              className="h-24 rounded-lg border border-gray-200 px-4 py-2"
              value={formData.bio}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, bio: text }))}
              multiline
              placeholder="자기소개를 입력해주세요"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm">국가</Text>
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
          <Text className="mb-4 text-sm">약관 및 마케팅 수신 동의</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() => toggleAgreement('terms')}>
            <View className="flex-row items-center">
              <AntDesign
                name={agreements.terms ? 'checkcircle' : 'checkcircleo'}
                size={20}
                color={agreements.terms ? '#FF6B00' : '#DDD'}
              />
              <Text className="ml-2 text-base">(주)기적 이용약관에 동의 (필수)</Text>
            </View>
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() => toggleAgreement('privacy')}>
            <View className="flex-row items-center">
              <AntDesign
                name={agreements.privacy ? 'checkcircle' : 'checkcircleo'}
                size={20}
                color={agreements.privacy ? '#FF6B00' : '#DDD'}
              />
              <Text className="ml-2 text-base">개인정보 수집 및 이용에 대한 안내 (필수)</Text>
            </View>
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-3"
            onPress={() => toggleAgreement('marketing')}>
            <View className="flex-row items-center">
              <AntDesign
                name={agreements.marketing ? 'checkcircle' : 'checkcircleo'}
                size={20}
                color={agreements.marketing ? '#FF6B00' : '#DDD'}
              />
              <Text className="ml-2 text-base">마케팅 정보 수신 동의 (선택)</Text>
            </View>
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* 수정 완료 버튼 */}
        <View className="p-4">
          <TouchableOpacity
            className="h-12 items-center justify-center rounded-lg bg-gray-200"
            disabled={!agreements.terms || !agreements.privacy}>
            <Text className="text-base text-white">수정 완료</Text>
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
                <Text className="ml-4 text-lg">국가 선택</Text>
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
                  placeholder="국가 검색..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <FlatList
              data={countries?.filter((country) =>
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
