import { AntDesign } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function AgreementScreen() {
  const router = useRouter();
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

  const handleNext = () => {
    if (agreements.terms && agreements.privacy) {
      router.push({
        pathname: '/register',
        params: {
          term_agreement: agreements.terms ? '1' : '0',
          privacy_agreement: agreements.privacy ? '1' : '0',
          marketing_agreement: agreements.marketing ? '1' : '0',
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: true,
        }}
      />

      <ScrollView className="flex-1 px-5">
        {/* 로고와 환영 메시지 */}
        <View className="mb-36 mt-8">
          <Image source={require('~/assets/icon.png')} className="h-48 w-48" resizeMode="contain" />
          <Text className="mt-4 text-2xl font-bold">BeraKorean에 오신 것을{'\n'}환영합니다!</Text>
          <Text className="mt-4 text-2xl font-bold">Welcome to BeraKorean!</Text>
        </View>

        {/* 모두 동의하기 버튼 */}
        <TouchableOpacity
          className="mb-8 flex-row items-center justify-center rounded-lg border border-[#7b33ff] py-4"
          onPress={() => {
            setAgreements({
              terms: true,
              privacy: true,
              marketing: true,
            });
          }}>
          <AntDesign name="check" size={20} color="#7b33ff" />
          <Text className="ml-2 text-base text-[#7b33ff]">Agree All and Start</Text>
        </TouchableOpacity>

        {/* 개별 동의 항목들 */}
        <TouchableOpacity
          className="flex-row items-center justify-between"
          onPress={() => toggleAgreement('terms')}>
          <View className="flex-row items-center">
            <AntDesign
              name={agreements.terms ? 'checkcircle' : 'checkcircleo'}
              size={22}
              color={agreements.terms ? '#7b33ff' : '#E8E8E8'}
            />
            <Text className="ml-3 text-base">Agree to BeraKorean Terms of Use (Required)</Text>
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
              color={agreements.privacy ? '#7b33ff' : '#E8E8E8'}
            />
            <Text className="ml-3 text-base">Agree to Privacy Policy (Required)</Text>
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
              color={agreements.marketing ? '#7b33ff' : '#E8E8E8'}
            />
            <Text className="ml-3 text-base">Receive Marketing Information (Optional)</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/terms/marketing')} className="p-2">
            <AntDesign name="right" size={16} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScrollView>

      {/* 시작하기 버튼 */}
      <View className="p-4">
        <TouchableOpacity
          className={`h-12 items-center justify-center rounded-lg ${
            agreements.terms && agreements.privacy ? 'bg-[#7b33ff]' : 'bg-gray-200'
          }`}
          onPress={handleNext}
          disabled={!agreements.terms || !agreements.privacy}>
          <Text className="text-base font-medium text-white">시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
