import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InquiryModal from './components/InquiryModal';

export default function SupportScreen() {
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  const handleEmailPress = async () => {
    await Linking.openURL('mailto:ordihong@naver.com');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Support',
        }}
      />
      <View className="flex-1 bg-white px-6 py-8">
        {/* 문의하기 섹션 */}
        <TouchableOpacity
          onPress={() => setShowInquiryModal(true)}
          className="mb-6 flex-row items-center justify-between rounded-lg bg-purple-50 p-4">
          <View className="flex-row items-center">
            <Feather name="message-circle" size={24} color="#9333ea" />
            <Text className="ml-3 text-lg font-medium text-gray-800">Inquiry</Text>
          </View>
          <Feather name="chevron-right" size={24} color="#9333ea" />
        </TouchableOpacity>

        {/* 이메일 문의 섹션 */}
        <View className="rounded-lg bg-gray-50 p-4">
          <Text className="mb-2 text-base font-medium text-gray-800">Email Inquiry</Text>
          <TouchableOpacity onPress={handleEmailPress} className="flex-row items-center">
            <Feather name="mail" size={20} color="#4b5563" />
            <Text className="ml-2 text-base text-purple-600 underline">ordihong@naver.com</Text>
          </TouchableOpacity>
          <Text className="mt-2 text-sm text-gray-500">
            We will respond to your inquiry as soon as possible.
          </Text>
        </View>

        <InquiryModal isVisible={showInquiryModal} onClose={() => setShowInquiryModal(false)} />
      </View>
    </>
  );
}
