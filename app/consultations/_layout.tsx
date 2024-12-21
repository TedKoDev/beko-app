import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function ConsultationLayout() {
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
            color: 'black',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: true,
          headerBackVisible: false,
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
            ) : null,
        }}
      />
    </PaperProvider>
  );
}
