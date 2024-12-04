import { router } from 'expo-router';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useAuthStore } from '~/store/authStore';
import { useAllGameProgress, useGameTypes } from '~/queries/hooks/games/useGameService';
import { UserLevelProgressBar } from '~/components/level/UserLevelProgressBar';
import { GameCard } from '~/components/game/GameCard';

export default function GameHome() {
  const { data: gameTypes, isLoading } = useGameTypes();
  const { data: allGameProgress } = useAllGameProgress();

  console.log('gameTypes', gameTypes);
  console.log('allGameProgress', allGameProgress);

  const handleGameSelect = (gameTypeId: number) => {
    console.log('gameTypeIddddd', gameTypeId);
    router.push(`/game/detail/${gameTypeId}`);
  };

  const allGames = React.useMemo(() => {
    const realGames = (gameTypes || []).map((game) => ({
      id: game.game_type_id,
      name: game.name,
      description: game.description,
      imageUrl: 'https://via.placeholder.com/100',
      type: 'game',
      isComingSoon: false as const,
    }));

    const totalNeeded = 4;
    const comingSoonCount = Math.max(0, totalNeeded - realGames.length);

    const comingSoonGames = Array(comingSoonCount)
      .fill(null)
      .map((_, index) => ({
        id: `coming-soon-${index}`,
        name: `Coming Soon ${index + 1}`,
        description: '새로운 게임이 곧 추가됩니다!',
        imageUrl: 'https://via.placeholder.com/100',
        type: 'coming-soon',
        isComingSoon: true as const,
      }));

    return [...realGames, ...comingSoonGames];
  }, [gameTypes]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile and Level Section */}
        <Surface className="mb-4 bg-white px-4 pb-4 pt-4">
          <View className="mt-4">
            <UserLevelProgressBar />
          </View>
        </Surface>

        {/* Games Grid */}
        <View className="px-4">
          <Text className="mb-4 text-xl font-bold text-gray-900">학습 게임</Text>
          <View className="flex-row flex-wrap justify-between">
            {allGames.map((game) => (
              <GameCard
                key={`game-${game.id}`}
                game={game}
                progress={allGameProgress?.find((p) => p.gameTypeId === Number(game.id))}
                onPress={() => !game.isComingSoon && handleGameSelect(Number(game.id))}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
