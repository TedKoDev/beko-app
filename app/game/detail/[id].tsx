import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import {
  useGameProgress,
  useGameQuestions,
  useGameTypes,
} from '~/queries/hooks/games/useGameService';

export default function GameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  console.log('id from params:', id);

  const { data: gameTypes } = useGameTypes();
  const { data: gameProgress } = useGameProgress(Number(id));
  const { data: gameQuestions } = useGameQuestions(Number(id));
  console.log('gameQuestions', gameQuestions);

  const currentGame = gameTypes?.find((game) => game.id === Number(id));

  if (!id || !currentGame) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: currentGame.name,
          headerShadowVisible: false,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Game Banner */}
        <View className="aspect-[16/9] w-full">
          <Image
            source={{ uri: currentGame.imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            <Text className="text-2xl font-bold text-white">{currentGame.name}</Text>
            <Text className="mt-1 text-sm text-white/80">{currentGame.description}</Text>
          </View>
        </View>

        {/* Level Info */}
        <Surface className="mx-4 -mt-6 overflow-hidden rounded-2xl bg-white">
          <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
              <Text className="ml-2 text-lg font-bold">
                Level {gameProgress?.currentLevel || 1}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="trophy" size={20} color="#6C47FF" />
              <Text className="ml-1 text-sm text-gray-600">
                Score: {gameProgress?.totalScore || 0}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View className="p-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm text-gray-600">진행률</Text>
              <Text className="text-sm font-medium text-gray-900">
                {Math.round((gameProgress?.experience || 0) / 10)}%
              </Text>
            </View>
            <View className="h-2 overflow-hidden rounded-full bg-gray-100">
              <View
                className="h-full bg-[#6C47FF]"
                style={{
                  width: `${(gameProgress?.experience || 0) / 10}%`,
                }}
              />
            </View>
          </View>
        </Surface>

        {/* Game Info */}
        <View className="mt-6 px-4">
          <Text className="mb-4 text-lg font-bold">게임 설명</Text>
          <Surface className="rounded-2xl p-4">
            <View className="flex-row items-center space-x-4">
              <View className="flex-1">
                <View className="mb-4 flex-row items-center">
                  <MaterialCommunityIcons name="gamepad-variant" size={20} color="#6C47FF" />
                  <Text className="ml-2 text-base font-medium">게임 방식</Text>
                </View>
                <Text className="text-sm text-gray-600">
                  이미지를 보고 알맞은 단어를 선택하는 게임입니다. 레벨이 올라갈수록 더 어려운
                  단어가 출제됩니다.
                </Text>
              </View>
            </View>
          </Surface>
        </View>

        {/* Start Button */}
        <View className="mt-8 px-4 pb-8">
          <Button
            mode="contained"
            onPress={() => {
              // TODO: 게임 시작 로직
            }}
            contentStyle={{ paddingVertical: 8 }}
            className="rounded-xl bg-[#6C47FF]">
            <Text className="text-lg font-bold text-white">게임 시작하기</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
