import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { healthCheckApi } from '~/services/authService';

export default function AuthLayout() {
  useEffect(() => {
    healthCheckApi();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#D812DC',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: true,
        headerBackVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#D812DC" />
            </TouchableOpacity>
          ) : null,
      }}>
      {/* <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
