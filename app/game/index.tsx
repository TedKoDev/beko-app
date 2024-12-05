import { router, Stack } from 'expo-router';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';

import { GameCard } from '~/components/game/GameCard';
import { UserLevelProgressBar } from '~/components/level/UserLevelProgressBar';
import { useAllGameProgress, useGameTypes } from '~/queries/hooks/games/useGameService';

export default function GameHome() {
  const { data: gameTypes, isLoading: gameTypesLoading } = useGameTypes();
  const { data: allGameProgress, isLoading: gameProgressLoading } = useAllGameProgress();

  const isLoading = gameTypesLoading || gameProgressLoading;

  const handleGameSelect = (gameTypeId: number) => {
    console.log('gameTypeId', gameTypeId);
    router.push(`/game/detail/${gameTypeId}`);
  };

  const allGames = React.useMemo(() => {
    const realGames = (gameTypes || []).map((game) => {
      const progress = allGameProgress?.find((p) => p.game_type_id === game.game_type_id);

      return {
        id: game.game_type_id,
        name: game.name,
        description: game.description,
        imageUrl: 'https://via.placeholder.com/100',
        type: 'game',
        isComingSoon: false as const,
        progress: progress
          ? {
              accuracy: progress.progress.accuracy,
              currentLevel: progress.progress.current_level,
              maxLevel: progress.progress.max_level,
              totalAttempts: progress.progress.total_attempts,
              totalCorrect: progress.progress.total_correct,
              lastPlayedAt: progress.progress.last_played_at,
            }
          : null,
      };
    });

    const totalNeeded = 4;
    const comingSoonCount = Math.max(0, totalNeeded - realGames.length);

    const comingSoonGames = Array(comingSoonCount)
      .fill(null)
      .map((_, index) => ({
        id: `coming-soon-${index}`,
        name: `Coming Soon ${index + 1}`,
        description: 'New game is coming soon!',
        imageUrl: 'https://via.placeholder.com/100',
        type: 'coming-soon',
        isComingSoon: true as const,
        progress: null,
      }));

    return [...realGames, ...comingSoonGames];
  }, [gameTypes, allGameProgress]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator animating={true} size="large" color="#6200ea" />
        <Text className="mt-4 text-gray-500">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          title: 'Game List',
          headerTitleAlign: 'center',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile and Level Section */}
        <Surface className="mb-4 bg-white px-4 pb-4 pt-4">
          <View className="mt-4">
            <UserLevelProgressBar />
          </View>
        </Surface>

        {/* Games Grid */}
        <View className="bg-white px-4">
          <Text className="my-4 text-xl font-bold text-gray-900">Game List</Text>
          <View className="flex-row flex-wrap justify-between">
            {allGames.map((game) => (
              <GameCard
                key={`game-${game.id}`}
                game={game}
                onPress={() => !game.isComingSoon && handleGameSelect(Number(game.id))}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
