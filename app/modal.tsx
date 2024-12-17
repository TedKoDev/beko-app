import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, View, Text, ScrollView, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { ScreenContent } from '~/components/ScreenContent';
import { adUnitId } from '~/src/config/ads';

// 테스트 광고 ID 사용

export default function Modal() {
  return (
    <ScrollView style={styles.container}>
      <ScreenContent path="app/modal.tsx" title="Support Developer" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <View style={styles.adContainer}>
        <Text style={styles.title}>Standard Banner</Text>
        <BannerAd
          unitId={adUnitId ?? ''}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />

        <Text style={styles.title}>Large Banner</Text>
        <BannerAd
          unitId={adUnitId ?? ''}
          size={BannerAdSize.LARGE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />

        <Text style={styles.title}>Medium Rectangle</Text>
        <BannerAd
          unitId={adUnitId ?? ''}
          size={BannerAdSize.MEDIUM_RECTANGLE}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />

        <Text style={styles.title}>Full Banner</Text>
        <BannerAd
          unitId={adUnitId ?? ''}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  adContainer: {
    gap: 20,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
});
