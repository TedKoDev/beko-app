import { Feather } from '@expo/vector-icons';
import { Link, Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';

import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';
import { useNotification } from '../../queries/hooks/notification/useNotification';

import { useAuthStore } from '~/store/authStore';

export default function TabLayout() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const { registerForPushNotifications } = useNotification();

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // 마이크로태스크 큐에 넣어서 마운트 이후에 실행되도록 함
    setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (
        isAuthenticated &&
        userInfo &&
        (!userInfo.terms_agreed || !userInfo.privacy_agreed)
      ) {
        router.replace('/terms-check');
      }
    }, 0);
  }, [isAuthenticated]);

  useEffect(() => {
    // 탭 레이아웃이 마운트되면(로그인 성공 후) 푸시 토큰 등록
    registerForPushNotifications().catch(console.error);
  }, []);

  // userInfo가 중첩 구조인 경우를 처리
  const username = userInfo?.username;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/icon.png')}
                style={{ width: 40, height: 40, marginLeft: 16, marginRight: 5 }}
              />
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>반가워요, {username} 님</Text>
            </View>
          ),
          headerRight: () => (
            <View className="mr-2 flex-row items-center gap-4">
              <Link href="/search" asChild>
                <Feather name="search" size={24} color="black" />
              </Link>
              <Link href="/modal" asChild>
                <HeaderButton />
              </Link>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Community',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ad"
        options={{
          title: 'Teacher',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="meetup" color={color} />,
        }}
      />

      <Tabs.Screen
        name="mypage"
        options={{
          title: 'My Page',
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
