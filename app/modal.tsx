import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { adUnitId } from '~/src/config/ads';

export default function Modal() {
  const openBuyMeACoffee = async () => {
    const url = 'https://www.buymeacoffee.com/ordihong';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Can't open the URL");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header 설정 */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Support Developer',
        }}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      {/* 상단 설명 */}
      <View className="rounded-b-3xl bg-purple-50 px-4 py-6">
        <Text className="mb-4 text-center text-2xl font-bold text-purple-900">
          Welcome to Bera Korean
        </Text>
        <Text className="mb-3 text-center text-base leading-6 text-gray-700">
          Thank you for using Bera Korean, a community designed for people who want to learn Korean,
          explore study-abroad opportunities in Korea, and consistently improve their Korean skills.
        </Text>
        <Text className="text-center text-base leading-6 text-gray-700">
          Your support means a lot! By viewing or clicking the ads on this page, you help the
          developer continue providing valuable content and features. Thank you for your
          encouragement!
        </Text>
      </View>

      {/* 본문 콘텐츠 */}
      <View className="items-center space-y-6 p-4">
        {/* Buy Me a Coffee */}
        {/* <View className="items-center space-y-4">
          <Text className="text-center text-lg font-bold text-purple-900">
            Buy Me a Coffee for Developer
          </Text>
          <TouchableOpacity
            onPress={openBuyMeACoffee}
            style={{ alignItems: 'center', marginBottom: 10 }}>
            <Image
              source={{
                uri: 'https://cdn.buymeacoffee.com/buttons/v2/default-violet.png',
              }}
              style={{ width: 217, height: 60 }}
            />
          </TouchableOpacity>
        </View> */}

        {/* Standard Banner Ad */}
        <View className="items-center space-y-4">
          <Text className="text-center text-lg font-bold text-purple-900">Standard Banner</Text>
          <View className="overflow-hidden rounded-xl bg-white shadow-sm">
            <BannerAd
              unitId={adUnitId ?? ''}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
          <Text className="text-center text-sm italic text-gray-500">
            Every little support counts. Thank you for watching!
          </Text>
        </View>

        {/* Large Banner Ad */}
        <View className="space-y-4">
          <Text className="text-center text-lg font-bold text-purple-900">Large Banner</Text>
          <View className="items-center overflow-hidden rounded-xl bg-white shadow-sm">
            <BannerAd
              unitId={adUnitId ?? ''}
              size={BannerAdSize.LARGE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
          <Text className="text-center text-sm italic text-gray-500">
            Helping you learn Korean while keeping this service running.
          </Text>
        </View>

        {/* Medium Rectangle Ad */}
        <View className="space-y-4">
          <Text className="text-center text-lg font-bold text-purple-900">Medium Rectangle</Text>
          <View className="items-center overflow-hidden rounded-xl bg-white shadow-sm">
            <BannerAd
              unitId={adUnitId ?? ''}
              size={BannerAdSize.MEDIUM_RECTANGLE}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
          <Text className="text-center text-sm italic text-gray-500">
            If you find Bera Korean helpful, please consider supporting us!
          </Text>
        </View>

        {/* Full Banner Ad */}
        <View className="space-y-4">
          <Text className="text-center text-lg font-bold text-purple-900">Full Banner</Text>
          <View className="overflow-hidden rounded-xl bg-white shadow-sm">
            <BannerAd
              unitId={adUnitId ?? ''}
              size={BannerAdSize.FULL_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
