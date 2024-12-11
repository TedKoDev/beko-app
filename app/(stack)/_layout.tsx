import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function StackLayout() {
  const router = useRouter();

  const backTap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      router.back();
    });

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#6C47FF',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#6C47FF" />
              </TouchableOpacity>
            ) : null,
        }}
      />
    </PaperProvider>
  );
}
