import React from 'react';
import { View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLevelThresholds, useUserLevelInfo } from '~/queries/hooks/level/useLevel';

interface LevelProgressBarProps {
  compact?: boolean;
}

export const LevelProgressBar = ({ compact = false }: LevelProgressBarProps) => {
  const { data: levelInfo } = useUserLevelInfo();
  const { data: thresholds } = useLevelThresholds();

  if (!levelInfo || !thresholds) return null;

  const currentLevel = levelInfo.currentLevel;
  const currentXP = levelInfo.currentXP;
  const nextLevelThreshold = thresholds.find((t) => t.level === currentLevel + 1);
  const currentLevelThreshold = thresholds.find((t) => t.level === currentLevel);

  if (!nextLevelThreshold || !currentLevelThreshold) return null;

  const xpForCurrentLevel = currentXP - currentLevelThreshold.min_experience;
  const xpRequiredForNextLevel =
    nextLevelThreshold.min_experience - currentLevelThreshold.min_experience;
  const progressPercentage = (xpForCurrentLevel / xpRequiredForNextLevel) * 100;

  if (compact) {
    return (
      <Surface className="flex-row items-center rounded-xl bg-white p-2">
        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
        <Text className="ml-1 text-sm font-medium">Lv.{currentLevel}</Text>
        <View className="ml-2 h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
          <View
            className="h-full rounded-full bg-[#6C47FF]"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </Surface>
    );
  }

  return (
    <Surface className="rounded-xl bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
          <View className="ml-2">
            <Text className="text-lg font-bold">Level {currentLevel}</Text>
            <Text className="text-sm text-gray-500">
              {xpForCurrentLevel.toLocaleString()} / {xpRequiredForNextLevel.toLocaleString()} XP
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-lg font-bold text-[#6C47FF]">
            {Math.round(progressPercentage)}%
          </Text>
          <Text className="text-xs text-gray-500">총 {currentXP.toLocaleString()} XP</Text>
        </View>
      </View>

      <View className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
        <View
          className="h-full rounded-full bg-[#6C47FF]"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>

      <View className="mt-2 flex-row justify-between">
        <View>
          <Text className="text-xs font-medium text-gray-700">현재 레벨 {currentLevel}</Text>
          <Text className="text-xs text-gray-500">
            {currentLevelThreshold.min_experience.toLocaleString()} XP
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-medium text-gray-700">다음 레벨 {currentLevel + 1}</Text>
          <Text className="text-xs text-gray-500">
            {nextLevelThreshold.min_experience.toLocaleString()} XP
          </Text>
        </View>
      </View>
    </Surface>
  );
};
