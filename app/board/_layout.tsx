import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function BoardLayout() {
  const router = useRouter();

  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7b33ff',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#7b33ff',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: true,
          headerBackVisible: true,
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="#7b33ff" />
              </TouchableOpacity>
            ) : null,
        }}
      />
    </PaperProvider>
  );
}
