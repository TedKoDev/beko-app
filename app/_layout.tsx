import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useSharedValue,
  withSpring,
  configureReanimatedLogger,
  ReanimatedLogLevel,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Notifications from 'expo-notifications';

import { useAuthStore } from '../store/authStore';

import '../global.css';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// 앱 최상단에 알림 핸들러 설정 -----------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
// -----------------------------
export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();
  const logoScale = useSharedValue(0);
  const [loading, setLoading] = useState(true); // 로딩 상태

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
  console.log('userInfo', userInfo);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await checkAuth();
        // 인증은 되어있지만 약관 동의가 안된 경우
        if (isAuthenticated && userInfo && (!userInfo.terms_agreed || !userInfo.privacy_agreed)) {
          console.log('약관 동의 안됨');
          router.replace('/terms-check');
        }
      } catch (error) {
        console.log('인증 실패');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // 인증되지 않았을 경우 로그인 페이지로 이동
  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      //console.log('Not authenticated');
      router.replace('/login'); // /auth/login이 아니라 /login으로
    }
  }, [isAuthenticated, loading]);

  // expo-notifications 설정 -----------------------------
  useEffect(() => {
    // 알� 수신 리스너 설정
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    // 알림 응답 리스너 설정 (사용자가 알림을 탭했을 때)
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  // -----------------------------

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
            </Stack>
          </QueryClientProvider>
        </BottomSheetModalProvider>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}
