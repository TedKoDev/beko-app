import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function GameLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6C47FF',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: 'white',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          ) : null,
      }}
    />
  );
}
