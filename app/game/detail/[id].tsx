import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { useGameLevelInfo, useGameProgress } from '~/queries/hooks/games/useGameService';

interface LevelCardProps {
  level: number;
  isLocked: boolean;
  onPress: () => void;
}

const LevelCard = ({ level, isLocked, onPress }: LevelCardProps) => {
  const rotation = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value + 180}deg` }],
    backfaceVisibility: 'hidden',
  }));

  const handlePress = () => {
    if (isLocked) return;

    const newRotation = isFlipped.value ? 0 : 180;
    rotation.value = withTiming(newRotation, { duration: 500 }, () => {
      runOnJS(onPress)();
    });
    isFlipped.value = !isFlipped.value;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="mb-6 h-[180px] w-[150px] rounded-2xl shadow-sm"
      style={{ opacity: isLocked ? 0.5 : 1 }}>
      <View className="relative h-full w-full">
        <Animated.View
          className="absolute h-full w-full items-center justify-center overflow-hidden rounded-2xl"
          style={frontAnimatedStyle}>
          <View className="h-[95%] w-[95%] items-center justify-center rounded-xl border-2 border-violet-500 bg-white">
            <Text className="mb-2 text-2xl font-bold text-gray-800">Lv {level}</Text>
            {isLocked && <MaterialCommunityIcons name="lock" size={32} color="#9CA3AF" />}
          </View>
        </Animated.View>
        <Animated.View
          className="absolute h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-violet-100"
          style={backAnimatedStyle}>
          <View className="h-[95%] w-[95%] items-center justify-center rounded-xl border-2 border-violet-500 bg-white">
            <Text className="text-2xl font-bold text-violet-500">Start</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default function GameDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: gameLevelInfo } = useGameLevelInfo(Number(id));
  const { data: gameProgress, isLoading: gameProgressLoading } = useGameProgress(Number(id));

  if (gameProgressLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  //console.log('gameProgress', gameProgress?.progress?.current_level);

  const currentLevel = gameProgress?.progress?.current_level;
  //console.log('currentLevel', currentLevel);

  const handleLevelSelect = (level: number) => {
    //console.log('level', level);

    router.replace(`/game/play/${id}?level=${level}`);
  };

  if (!gameLevelInfo) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: gameLevelInfo?.game_name,
          headerTitleAlign: 'center',
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          padding: 20,
          gap: 10,
        }}>
        {Array.from({ length: gameLevelInfo?.level_info.max_level || 0 }, (_, index) => (
          <LevelCard
            key={index}
            level={index + 1}
            isLocked={index + 1 > (currentLevel || 0)}
            onPress={() => handleLevelSelect(index + 1)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
