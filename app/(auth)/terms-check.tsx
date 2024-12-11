import { AntDesign } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useAgreements } from '~/queries/hooks/notification/useNotification';
import { useAuthStore } from '~/store/authStore';

export default function TermsCheckScreen() {
  const router = useRouter();
  const { userInfo, userToken, setUserInfo } = useAuthStore();
  const [agreements, setAgreements] = useState({
    terms: userInfo?.terms_agreed || false,
    privacy: userInfo?.privacy_agreed || false,
    marketing: userInfo?.marketing_agreed || false,
  });
  const { updateAgreements, isUpdating } = useAgreements();

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (agreements.terms && agreements.privacy && userToken) {
      try {
        await updateAgreements({
          terms_agreed: agreements.terms,
          privacy_agreed: agreements.privacy,
          marketing_agreed: agreements.marketing,
        });

        // 성공적으로 업데이트되면 메인 화면으로 이동
        router.replace('/');
      } catch (error) {
        console.error('Failed to update agreements:', error);
        alert('약관 동의 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />

      <ScrollView className="flex-1 px-5">
        <View className="mb-36 mt-8">
          <Image source={require('~/assets/icon.png')} className="h-48 w-48" resizeMode="contain" />
          <Text className="mt-4 text-2xl font-bold">
            서비스 이용을 위해{'\n'}약관 동의가 필요합니다
          </Text>
        </View>

        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-lg border border-[#6C47FF] py-4"
          onPress={() => {
            setAgreements({
              terms: true,
              privacy: true,
              marketing: true,
            });
          }}>
          <AntDesign name="check" size={20} color="#6C47FF" />
          <Text className="ml-2 text-base text-[#6C47FF]">모두 동의하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between"
          onPress={() => toggleAgreement('terms')}>
          <View className="flex-row items-center">
            <AntDesign
              name={agreements.terms ? 'checkcircle' : 'checkcircleo'}
              size={22}
              color={agreements.terms ? '#6C47FF' : '#E8E8E8'}
            />
            <Text className="ml-3 text-base">BeraKorean 이용약관에 동의 (필수)</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/terms/terms')} className="p-2">
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between"
          onPress={() => toggleAgreement('privacy')}>
          <View className="flex-row items-center">
            <AntDesign
              name={agreements.privacy ? 'checkcircle' : 'checkcircleo'}
              size={22}
              color={agreements.privacy ? '#6C47FF' : '#E8E8E8'}
            />
            <Text className="ml-3 text-base">개인정보 수집 및 이용에 대한 안내 (필수)</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/terms/privacy')} className="p-2">
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between"
          onPress={() => toggleAgreement('marketing')}>
          <View className="flex-row items-center">
            <AntDesign
              name={agreements.marketing ? 'checkcircle' : 'checkcircleo'}
              size={22}
              color={agreements.marketing ? '#6C47FF' : '#E8E8E8'}
            />
            <Text className="ml-3 text-base">마케팅 정보 수신 동의 (선택)</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/terms/marketing')} className="p-2">
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>

      <View className="p-4">
        <TouchableOpacity
          className={`h-12 items-center justify-center rounded-lg ${
            agreements.terms && agreements.privacy ? 'bg-[#6C47FF]' : 'bg-gray-200'
          }`}
          onPress={handleSubmit}
          disabled={!agreements.terms || !agreements.privacy || isUpdating}>
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-medium text-white">동의하고 계속하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
