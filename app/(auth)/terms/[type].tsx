import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

const TERMS_CONTENT = {
  terms: {
    title: 'BeraKorean 이용약관',
    content: `
제1조 (목적)
이 약관은 BeraKorean (이하 "회사")이 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.
2. "회원"이란 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 개인을 의미합니다.
...`,
  },
  privacy: {
    title: '개인정보 수집 및 이용에 대한 안내',
    content: `
1. 수집하는 개인정보의 항목
- 필수항목: 이메일 주소, 비밀번호, 이름
- 선택항목: 프로필 사진, 생년월일, 성별

2. 개인정보의 수집 및 이용목적
- 서비스 제공 및 회원관리
- 신규 서비스 개발 및 마케팅
...`,
  },
  marketing: {
    title: '마케팅 정보 수신 동의',
    content: `
마케팅 정보 수신 동의는 선택사항이며, 동의하지 않아도 서비스를 이용하실 수 있습니다.

1. 마케팅 정보 수신 동의 시 수집항목
- 이메일 주소, 휴대폰 번호

2. 이용목적
- 새로운 서비스 및 이벤트 정보 제공
- 맞춤형 광고 제공
...`,
  },
};

export default function TermsDetailScreen() {
  const { type } = useLocalSearchParams<{ type: keyof typeof TERMS_CONTENT }>();
  const content = TERMS_CONTENT[type];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: content.title,
          headerTitleStyle: {
            fontSize: 16,
          },
        }}
      />
      <ScrollView className="flex-1 p-5">
        <Text className="text-base leading-6">{content.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
