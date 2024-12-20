import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function GameLayout() {
  const router = useRouter();

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
            color: '#7b33ff',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackVisible: false,
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
