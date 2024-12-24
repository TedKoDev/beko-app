import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { healthCheckApi } from '~/services/authService';
import { useCountryData } from '~/store/countryStore';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#7b33ff',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: true,
        headerBackVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#7b33ff" />
            </TouchableOpacity>
          ) : null,
      }}>
      {/* <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
