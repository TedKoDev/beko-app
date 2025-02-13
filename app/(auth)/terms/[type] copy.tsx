import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, SafeAreaView, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

const TERMS_LINKS = {
  terms: {
    title: 'BeraKorean Terms',
    url: 'https://flame-mascara-204.notion.site/155a507c1a62801b8585ef4d9ca7aa67?pvs=4',
  },
  privacy: {
    title: 'BeraKorean Privacy',
    url: 'https://flame-mascara-204.notion.site/Policy-15da507c1a62806aa0cbe24c8769c536?pvs=4',
  },
  marketing: {
    title: 'BeraKorean Marketing',
    url: 'https://flame-mascara-204.notion.site/Marketing-Consent-Policy-15da507c1a6280f4b1c4d12181f1fbdb?pvs=4',
  },
};

export default function TermsDetailScreen() {
  const { type } = useLocalSearchParams<{ type: keyof typeof TERMS_LINKS }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Stack.Screen
        options={{
          headerTitle: TERMS_LINKS[type].title,
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />

      <WebView
        source={{ uri: TERMS_LINKS[type].url }}
        className="h-[600px] flex-1 bg-white"
        style={{ flex: 1 }}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#7b33ff" />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
      />
    </SafeAreaView>
  );
}
