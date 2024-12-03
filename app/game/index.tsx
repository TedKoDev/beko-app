import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';

import { useGameProgress, useGameTypes } from '~/queries/hooks/games/useGameService';
import { GameType } from '~/types/game';

export default function GameHome() {
  const { data: gameTypes, isLoading } = useGameTypes();
  const { data: gameProgress } = useGameProgress(1);

  console.log('gameTypes', gameTypes);
  console.log('gameProgress', gameProgress);

  const handleGameSelect = (gameTypeId: number) => {
    router.push({
      pathname: '/game/detail/[id]',
      params: { id: gameTypeId },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
        {gameTypes?.map((game) => (
          <TouchableOpacity
            key={game.id}
            onPress={() => handleGameSelect(game.id)}
            className="w-full">
            <Surface className="flex-row items-center overflow-hidden rounded-2xl bg-white p-4">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-[#F4A460]">
                <MaterialCommunityIcons name="gamepad-variant" size={24} color="white" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-bold text-gray-900">{game.name}</Text>
                    <Text className="text-sm text-gray-500">{game.description}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#6C47FF" />
                </View>
              </View>
            </Surface>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
