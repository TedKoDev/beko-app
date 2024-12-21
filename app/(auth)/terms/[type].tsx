import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';

const TERMS_LINKS = {
  terms: {
    title: 'BeraKorean Terms',
    url: 'https://flame-mascara-204.notion.site/Term-155a507c1a62801b8585ef4d9ca7aa67?pvs=4',
  },
  privacy: {
    title: 'BeraKorean Privacy',
    url: 'https://flame-mascara-204.notion.site/Policy-15da507c1a62806aa0cbe24c8769c536?pvs=4',
  },
  marketing: {
    title: 'BeraKorean Marketing',
    url: 'https://flame-mascara-204.notion.site/Marketing-Consent-Policy-15da507c1a6280f4b1c4d12181f1fbdb?pvs=4',
  },
} as const;

export default function TermsDetailScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  // 디버깅을 위한 로그 추가
  //console.log('Received type:', type);
  //console.log('Type of received type:', typeof type);
  //console.log('Available types:', Object.keys(TERMS_LINKS));

  if (!type || !TERMS_LINKS[type as keyof typeof TERMS_LINKS]) {
    //console.log('Invalid type received:', type);
    return <ActivityIndicator />;
  }

  const currentTerms = TERMS_LINKS[type as keyof typeof TERMS_LINKS];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: currentTerms.title,
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />
      <WebView source={{ uri: currentTerms.url }} />
    </>
  );
}
