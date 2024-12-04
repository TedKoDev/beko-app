import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { GameProgress, GameCardType } from '~/types/game';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GameCardProps {
  game: GameCardType;
  progress?: GameProgress;
  onPress: () => void;
}

export const GameCard = ({ game, progress, onPress }: GameCardProps) => {
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
      <Surface className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <View className="h-32 bg-gray-100">
          {game.isComingSoon ? (
            <View className="flex-1 items-center justify-center bg-gray-100">
              <MaterialCommunityIcons name="gamepad-variant" size={40} color="#9CA3AF" />
            </View>
          ) : (
            <Image source={{ uri: game.imageUrl }} className="h-full w-full" resizeMode="cover" />
          )}
          {!game.isComingSoon && (
            <View className="absolute bottom-0 left-0 right-0 bg-black/30 p-2">
              <Text className="text-center text-sm font-medium text-white">시작하기</Text>
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
          {!game.isComingSoon && progress && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text className="ml-1 text-xs text-gray-500">
                  레벨 {progress?.currentLevel || 1}
                </Text>
              </View>
              <View className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                <View
                  className="h-full bg-[#6C47FF]"
                  style={{
                    width: `${(progress?.experience || 0) / 100}%`,
                  }}
                />
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
      </Surface>
    </AnimatedPressable>
  );
};
