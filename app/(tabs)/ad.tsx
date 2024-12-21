import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';

import NoticeCategories from '~/components/notice/NoticeSection';
import { AdBanner } from '~/src/components/ads/AdBanner';

type Language = 'ko' | 'en' | 'jp';
type TabType = 'ads' | 'teacher';

const content = {
  ko: {
    title: '강사 소개',
    greeting: '안녕하세요!',
    name: '한국어 강사 Bera(베라)입니다.',
    intro: {
      title: '소개',
      content:
        '저는 한국어 교육을 전공하였고 대학교에서 한국어를 가르친 경험이 있습니다. 다양한 외국인들을 가르치면서 쉽고 재미있게 가르치는 방법을 고민하게 되었고 학습자의 입장에서 이해하기 쉽도록 강의를 구성하고 있습니다.',
      closing: '전문적이고 체계적으로 한국어를 공부를 시작해 보세요~^^',
    },
    recommended: {
      title: '이런 분들께 추천합니다',
      items: [
        '기초부터 탄탄하게 한국어 공부를 하고 싶으신 분',
        '체계적으로 한국어 공부를 하고 싶으신 분',
        '자연스러운 한국어 말하기 연습이 필요하신 분',
        '정확하고 꼼꼼한 피드백을 원하시는 분',
      ],
    },
    background: {
      title: '학력 및 경력',
      items: [
        '연세대학교 외국어로서의 한국어 교육 석사 전공',
        '한국어 교원 2급 자격증',
        '토픽 채점자 과정 수료',
        '공립교육기관 다문화 학생들을 대상으로 한국어 교육 경력',
        '대학교 어학당에서 한국어 교육 경력',
      ],
    },
  },
  en: {
    title: 'About the Teacher',
    greeting: 'Hello!',
    name: "I'm Korean teacher Bera",
    intro: {
      title: 'Introduction',
      content:
        "I majored in Korean language education and have experience teaching Korean at universities. While teaching various foreign students, I focused on developing easy and fun teaching methods, structuring lessons to be easily understood from the learner's perspective.",
      closing: 'Start learning Korean professionally and systematically~^^',
    },
    recommended: {
      title: 'Recommended for',
      items: [
        'Those who want to build a solid foundation in Korean',
        'Those seeking systematic Korean study',
        'Those needing natural Korean speaking practice',
        'Those wanting accurate and detailed feedback',
      ],
    },
    background: {
      title: 'Education & Experience',
      items: [
        "Master's in Korean Language Education, Yonsei University",
        'Level 2 Korean Language Teacher Certificate',
        'TOPIK Examiner Training Completion',
        'Experience teaching Korean to multicultural students in public institutions',
        'Experience teaching Korean at university language institutes',
      ],
    },
  },
  jp: {
    title: '講師紹介',
    greeting: 'こんにちは！',
    name: '韓国語講師のBera（ベラ）です。',
    intro: {
      title: '紹介',
      content:
        '韓国語教育を専攻し、大学で韓国語を教えた経験があります。様々な外国人に教えながら、わかりやすく楽しく教える方法を考え、学習者の立場で理解しやすいように講義を構成しています。',
      closing: 'プロフェッショナルで体系的に韓国語の勉強を始めましょう~^^',
    },
    recommended: {
      title: 'こんな方におすすめです',
      items: [
        '基礎からしっかりと韓国語を学びたい方',
        '体系的に韓国語を学びたい方',
        '自然な韓国語会話の練習が必要な方',
        '正確で丁寧なフィードバックを望む方',
      ],
    },
    background: {
      title: '学歴・経歴',
      items: [
        '延世大学校 外国語としての韓国語教育 修士専攻',
        '韓国語教員2級資格証',
        'TOPIK採点者課程修了',
        '公立教育機関での多文化学生向け韓国語教育経験',
        '大学語学堂での韓国語教育経験',
      ],
    },
  },
};
export default function AdPage() {
  const { type } = useLocalSearchParams<{ type: string }>();
  console.log('type', type);
  const [language, setLanguage] = useState<Language>('ko');
  const [activeTab, setActiveTab] = useState<TabType>(type === 'ads' ? 'ads' : 'teacher');
  const currentContent = content[language];

  // const { data: adBannerResponse } = useAdbanner({ limit: 5 });

  const links = {
    ko: {
      cafetalk: '카페톡에서 수업 신청하기',
      youtube: '유튜브 채널 구경하기',
      cta: '1:1 상담 신청하기',
    },
    en: {
      cafetalk: 'Book Lessons on Cafetalk',
      youtube: 'Visit YouTube Channel',
      cta: 'Ask 1:1 Consultation',
    },
    jp: {
      cafetalk: 'Cafetalkでレッスンを予約',
      youtube: 'YouTubeチャンネルを見る',
      cta: '1:1 相談を申し込む',
    },
  };

  // type이 'ads'일 때만 광고 탭 활성화
  useEffect(() => {
    if (type === 'ads') {
      setActiveTab('ads');
    }
  }, [type]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ads':
        return (
          <ScrollView className="flex-1">
            {/* <View className="mb-6">
              <CustomCarousel items={adBanners} />
            </View> */}
            <NoticeCategories />
          </ScrollView>
        );
      case 'teacher':
        return (
          <View className="flex-1 px-4">
            {/* Language Selector */}
            <View className="flex-row justify-center space-x-2 border-b border-gray-100 px-6 py-3">
              {(['en', 'ko', 'jp'] as Language[]).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  onPress={() => setLanguage(lang)}
                  className={`mr-2 rounded-xl px-4 py-2 ${
                    language === lang ? 'bg-purple-custom' : 'bg-gray-200'
                  }`}>
                  <Text
                    className={`font-medium ${language === lang ? 'text-white' : 'text-gray-600'}`}>
                    {lang.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Teacher Content */}
            <ScrollView className="flex-1 ">
              {/* Header Section */}
              <View className="mb-8 items-center py-6">
                <Text className="text-3xl font-bold text-gray-800">{currentContent.greeting}</Text>
                <Text className="mt-3 text-xl text-gray-600">{currentContent.name}</Text>
              </View>

              {/* Introduction Section */}
              <View className="mb-8 rounded-lg bg-purple-50 p-6">
                <Text className=" mb-3 text-xl font-bold text-purple-custom">
                  {currentContent.intro.title}
                </Text>
                <Text className="text-base leading-7 text-gray-700">
                  {currentContent.intro.content}
                </Text>
                <Text className="mt-4 text-base font-bold text-purple-custom">
                  {currentContent.intro.closing}
                </Text>
              </View>
              {/* <AdBanner /> */}
              {/* Call-to-Action Section */}
              <View className="mb-8 rounded-lg bg-purple-100 p-6">
                <Text className="mb-4 text-xl font-bold text-purple-custom">
                  {links[language].cta}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://cafetalk.com/tutor/profile/?c=eJzLrwp09s7R9tNPCSqrTM7KdkwuSE1Kt7UFAGnjCHY.&lang=en'
                    )
                  }
                  className="mb-3 rounded-full bg-purple-custom px-6 py-3">
                  <Text className="text-center text-white">{links[language].cafetalk}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.youtube.com/@berakorean')}
                  className="mb-4 rounded-full bg-red-600 px-6 py-3">
                  <Text className="text-center text-white">{links[language].youtube}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/consultations')}
                  className="rounded-full bg-blue-600 px-6 py-3">
                  <Text className="text-center text-white">{links[language].cta}</Text>
                </TouchableOpacity>
              </View>

              {/* Recommended For Section */}
              <View className="mb-8 rounded-lg bg-gray-50 p-6">
                <Text className="mb-4 text-xl font-bold text-gray-800">
                  {currentContent.recommended.title}
                </Text>
                {currentContent.recommended.items.map((text, index) => (
                  <View key={index} className="mb-2 flex-row items-center last:mb-0">
                    <Text className="purple-custom mr-2">•</Text>
                    <Text className="text-base leading-7 text-gray-700">{text}</Text>
                  </View>
                ))}
              </View>

              {/* Academic Background Section */}
              <View className="mb-8 rounded-lg bg-gray-50 p-6">
                <Text className="mb-4 text-xl font-bold text-gray-800">
                  {currentContent.background.title}
                </Text>
                {currentContent.background.items.map((text, index) => (
                  <View key={index} className="mb-2 flex-row items-center last:mb-0">
                    <Text className="purple-custom mr-2">•</Text>
                    <Text className="text-base leading-7 text-gray-700">{text}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tab Buttons */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('teacher')}
          className={`flex-1 p-4 ${activeTab === 'teacher' ? 'border-b-2 border-purple-custom' : ''}`}>
          <Text
            className={`text-center font-medium ${
              activeTab === 'teacher' ? 'text-purple-custom' : 'text-gray-600'
            }`}>
            Teacher
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('ads')}
          className={`flex-1 p-4 ${activeTab === 'ads' ? 'border-b-2 border-purple-custom' : ''}`}>
          <Text
            className={`text-center font-medium ${
              activeTab === 'ads' ? 'text-purple-custom' : 'text-gray-600'
            }`}>
            Info
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </View>
  );
}
