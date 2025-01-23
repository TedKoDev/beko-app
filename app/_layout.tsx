import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Animated, KeyboardAvoidingView, Alert, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useSharedValue,
  configureReanimatedLogger,
  ReanimatedLogLevel,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboarding';

import '../global.css';

import { checkAppVersion } from '~/services/checkVersionService';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// // 앱 최상단에 알림 핸들러 설정 -----------------------------
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });
// -----------------------------
export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const logoScale = useSharedValue(0);
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 버전 체크 useEffect 추가
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const { needsUpdate, storeUrl } = await checkAppVersion().catch(() => ({
          needsUpdate: false,
          storeUrl: '',
        }));

        if (needsUpdate && storeUrl) {
          Alert.alert(
            'Update Required',
            'There is a new version available. Please update from the store.',
            [
              {
                text: 'Update',
                onPress: () => {
                  try {
                    Linking.openURL(storeUrl).catch((error) => {
                      console.log('Failed to open store URL:', error);
                      // 스토어 열기 실패시 대체 메시지
                      Alert.alert(
                        'Store Error',
                        'Could not open the store. Please update the app manually.',
                        [{ text: 'OK' }]
                      );
                    });
                  } catch (error) {
                    console.log('Failed to handle store link:', error);
                  }
                },
              },
              {
                text: 'Later',
                style: 'cancel',
                // 개발 환경이나 테스트 환경에서는 업데이트를 건너뛸 수 있도록
                onPress: () => console.log('Update postponed'),
              },
            ],
            {
              cancelable: __DEV__, // 개발 환경에서만 취소 가능
            }
          );
        }
      } catch (error) {
        console.log('Version check failed:', error);
        // 버전 체크 실패시 조용히 처리
      }
    };

    if (!__DEV__) {
      // 개발 환경에서는 버전 체크 스킵
      checkVersion();
    }
  }, []); // 앱 시작시 한번만 실행

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1분
        gcTime: 1000 * 60 * 5, // 5분
      },
    },
  });

  // 애니메이션 스타일 정의
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  const userInfo = useAuthStore((state) => state.userInfo);
  //console.log('userInfo', userInfo);

  const hasSeenOnboarding = useOnboardingStore((state) => state.hasSeenOnboarding);
  //console.log('hasSeenOnboarding', hasSeenOnboarding);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // await healthCheckApi();
        await checkAuth();

        if (isAuthenticated && userInfo) {
          // 약관 동의 체크
          if (!userInfo.terms_agreed || !userInfo.privacy_agreed) {
            //console.log('약관 동의 안됨');
            router.replace('/terms-check');
          }
        } else if (!loading && isAuthenticated === false) {
          //console.log('인증 실패');
          if (hasSeenOnboarding) {
            router.replace('/login');
          } else {
            router.replace('/first');
          }
        }
      } catch (error) {
        //console.log('인증 실패');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [isAuthenticated, loading]);

  if (loading || isAuthenticated === null) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}>
          <Animated.Image
            source={require('../assets/icon.png')}
            style={[{ width: 150, height: 150 }, animatedStyle]}
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <QueryClientProvider client={queryClient}>
            <Stack>
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(stack)" options={{ headerShown: false }} />
              <Stack.Screen name="game" options={{ headerShown: false }} />
              <Stack.Screen
                name="voca"
                options={{
                  headerTitle: 'Voca Section',
                  headerShown: false,
                  headerTintColor: '#D812DC',
                }}
              />
              <Stack.Screen name="event" options={{ headerShown: false }} />
              <Stack.Screen name="write" options={{ headerShown: false }} />
              <Stack.Screen name="consultations" options={{ headerShown: false }} />
              <Stack.Screen name="board" options={{ headerShown: false }} />
              <Stack.Screen name="setting" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

              {/* <Stack.Screen name="consultations" options={{ headerShown: false }} /> */}
            </Stack>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
