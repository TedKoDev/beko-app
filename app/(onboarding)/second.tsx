import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

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
      <View className="flex-1 bg-blue-600 p-5">
        <View className="flex-1">
          {/* 메인 컨테이너 */}
          <View className="mx-4 mt-28 h-[400px] rounded-3xl bg-red-500 px-5 pt-5">
            {/* 임시 이미지/비디오 영역 */}
            <View className="mt-20 h-[300px] w-full rounded-xl bg-gray-100">
              {/* 여기에 실제 컨텐츠가 들어갈 예정 */}
            </View>
          </View>
          <View className="mt-10 bg-red-500">
            <Text className="mb-2 text-center text-2xl font-bold text-black">
              Find the cheapest hot deals{'\n'}arriving tomorrow
            </Text>
            <Text className="text-center text-lg text-gray-600">
              Search all shopping app hot deals at once
            </Text>
          </View>
        </View>
        {/* 페이지 인디케이터 */}
        <View className="mb-8 mt-10 flex-row justify-center gap-5">
          <View className="h-5 w-5 rounded-full bg-gray-300" />
          <View className="h-5 w-5 rounded-full bg-[#7b33ff]" />
          <View className="h-5 w-5 rounded-full bg-gray-300" />
        </View>
        {/* 하단 텍스트 및 버튼 영역 */}
        <View className="px-4 pb-8">
          {/* 다음 버튼 */}
          <TouchableOpacity
            className="h-14 w-full rounded-xl bg-black"
            onPress={() => router.push('/(onboarding)/third')}>
            <Text className="h-full text-center text-2xl font-extrabold leading-[50px] text-white">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </PanGestureHandler>
  );
}
