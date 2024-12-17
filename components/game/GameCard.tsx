import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Image, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GameProgress {
  accuracy: number;
  currentLevel: number;
  maxLevel: number;
  totalAttempts: number;
  totalCorrect: number;
  lastPlayedAt: string | null;
}

interface GameCardType {
  id: number | string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'game' | 'coming-soon';
  isComingSoon: boolean;
  progress: GameProgress | null;
}

interface GameCardProps {
  game: GameCardType;
  onPress: () => void;
}

export const GameCard = ({ game, onPress }: GameCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle]}
      className="mb-4 w-[48%]"
      disabled={game.isComingSoon}>
      <View className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <View className="h-32 bg-purple-400">
          {game.isComingSoon ? (
            <View className="flex-1 items-center justify-center">
              <MaterialCommunityIcons name="gamepad-variant" size={40} color="blue" />
            </View>
          ) : game.imageUrl ? (
            <Image
              source={require('~/assets/icon.png')}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <MaterialCommunityIcons name="image-off-outline" size={40} color="white" />
            </View>
          )}
          {!game.isComingSoon && (
            <View className="absolute bottom-0 left-0 right-0 bg-black/30 p-2">
              <Text className="text-center text-sm font-medium text-white">Start</Text>
            </View>
          )}
        </View>
        <View className="p-3">
          <Text className="mb-1 text-base font-bold" numberOfLines={1}>
            {game.name}
          </Text>
          <Text className="mb-2 text-xs text-gray-500" numberOfLines={2}>
            {game.description}
          </Text>
          {!game.isComingSoon && game.progress && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="progress-star" size={16} color="#FFD700" />
                <Text className="ml-1 text-xs text-gray-500">
                  Stage {game.progress.currentLevel}
                </Text>
              </View>
            </View>
          )}
          {game.isComingSoon && (
            <View className="flex-row items-center justify-center rounded-full bg-gray-100 py-1">
              <MaterialCommunityIcons name="clock-outline" size={16} color="#9CA3AF" />
              <Text className="ml-1 text-xs font-medium text-gray-400">Coming Soon</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};
