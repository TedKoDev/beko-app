import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
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
  const windowHeight = Dimensions.get('window').height;

  return (
    // <View style={{ flex: 1, backgroundColor: 'white', height: windowHeight }}>
    <>
      <View style={{ backgroundColor: 'red' }}>
        <Stack.Screen
          options={{
            headerTitle: TERMS_LINKS[type].title,
            headerTitleStyle: {
              fontSize: 16,
            },
          }}
        />
      </View>
      <WebView source={{ uri: TERMS_LINKS[type].url }} />
    </>
  );
}
