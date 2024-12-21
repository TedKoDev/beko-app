import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Link } from 'expo-router';

import { LevelProgressBar } from '~/components/level/LevelProgressBar';

export default function GameResult() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    correctAnswers: string;
    totalQuestions: string;
    currentLevel: string;
    leveledUp: string;
    experienceGained: string;
    userLeveledUp: string;
    currentUserLevel: string;
    gameId: string;
  }>();

  //console.log('Game Result - Received params:', JSON.stringify(params, null, 2));
  // 진입할때 'userInfo' 쿼리 무효화
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ['userInfo'] });

  const correctAnswers = Number(params.correctAnswers);
  const totalQuestions = Number(params.totalQuestions);
  const accuracy =
    !isNaN(correctAnswers) && !isNaN(totalQuestions) && totalQuestions !== 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-6">
        <Animated.View entering={FadeInDown.delay(200)} className="items-center space-y-8">
          <View className="w-full rounded-3xl bg-white p-8 shadow-lg">
            <Text className="text-center text-3xl font-extrabold text-[#4B3CFA]">Game Results</Text>

            <View className="my-8 items-center">
              <Text className="text-7xl font-extrabold text-[#FF6B6B]">{accuracy}%</Text>
              <Text className="mt-2 text-lg text-gray-600">Accuracy</Text>
            </View>

            <View className="space-y-6">
              <View className="flex-row justify-between">
                <Text className="text-lg">Correct Answers</Text>
                <Text className="text-lg font-bold">
                  {correctAnswers}/{totalQuestions}
                </Text>
              </View>

              {params.leveledUp === 'true' && (
                <View className="rounded-lg bg-yellow-200 p-5">
                  <Text className="text-center text-lg font-semibold text-yellow-900">
                    🎉 Level {params.currentLevel} Achieved!
                  </Text>
                </View>
              )}
              {/* Level Progress Section */}
              <View className="mb-4">
                <LevelProgressBar />
              </View>
              {params.userLeveledUp === 'true' && (
                <View className="rounded-lg bg-blue-200 p-5">
                  <Text className="text-center text-lg font-semibold text-blue-900">
                    ⭐️ User Level {params.currentUserLevel} Reached!
                  </Text>
                </View>
              )}

              {Number(params.experienceGained) > 0 && (
                <View className="rounded-lg bg-green-200 p-5">
                  <Text className="text-center text-lg font-semibold text-green-900">
                    +{params.experienceGained} XP Earned!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        <View className="mt-6 space-y-4">
          <TouchableOpacity
            className="rounded-full bg-[#7b33ff] py-3"
            onPress={() => {
              router.dismissAll();
              router.replace('/game');
            }}>
            <Text className="text-center text-base font-bold text-white">Game List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
