import { Feather, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Platform, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function StackLayout() {
  const router = useRouter();

  const backTap = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      router.back();
    });

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerTintColor: '#B227D4',
        headerLeft: () => (
          <GestureDetector gesture={backTap}>
            <View>
              <Ionicons name="chevron-back" size={24} color="#B227D4" />
            </View>
          </GestureDetector>
        ),
      }}
    />
  );
}
