import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';

export default function Second() {
  const router = useRouter();

  const handleSwipe = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    const { translationX, state } = event.nativeEvent;
    if (state === State.END) {
      if (translationX < -50) {
        router.push('/(onboarding)/third');
      } else if (translationX > 50) {
        router.back();
      }
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-between">
          <View className="flex-1">
            <View className="mx-4 flex-[0.7] rounded-3xl bg-purple-custom px-5 pt-5">
              <View className="h-full w-full overflow-hidden rounded-xl bg-gray-100">
                <Video
                  source={require('../../assets/videos/commu.mp4')}
                  style={{ width: '100%', height: '120%' }}
                  resizeMode={ResizeMode.COVER}
                  isLooping
                  isMuted
                  shouldPlay
                />
              </View>
            </View>

            <View className="mt-5 flex-[0.3] px-4">
              <Text className="mb-2 text-center text-2xl font-bold text-black">
                Korean language Community{'\n'}"Bera Korean"
              </Text>
              <Text className="text-center text-lg text-gray-600">
                Let's join the community{'\n'}and share your knowledge
              </Text>
            </View>
          </View>

          <View className="px-4 pb-5">
            <View className="mb-4 flex-row justify-center gap-5">
              <View className="h-5 w-5 rounded-full bg-gray-300" />
              <View className="h-5 w-5 rounded-full bg-[#7b33ff]" />
              <View className="h-5 w-5 rounded-full bg-gray-300" />
            </View>

            <TouchableOpacity
              className="h-14 w-full rounded-xl bg-black"
              onPress={() => router.push('/(onboarding)/third')}>
              <Text className="h-full text-center text-2xl font-extrabold leading-[50px] text-white">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}
