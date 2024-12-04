import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';

import { useUserInfo } from '~/queries/hooks/auth/useUserinfo';
import { useLevelThresholds, useUserLevelInfo } from '~/queries/hooks/level/useLevel';

export const UserLevelProgressBar = () => {
  const { data: levelInfo, isLoading: isLevelInfoLoading } = useUserLevelInfo();
  const { data: thresholds, isLoading: isThresholdsLoading } = useLevelThresholds();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo();

  const isLoading = isLevelInfoLoading || isThresholdsLoading || isUserInfoLoading;

  if (!levelInfo || !thresholds || !userInfo) return null;

  const currentLevel = levelInfo.currentLevel;
  const currentXP = levelInfo.currentXP;
  const nextLevelThreshold = thresholds.find((t) => t.level === currentLevel + 1);
  const currentLevelThreshold = thresholds.find((t) => t.level === currentLevel);

  if (!nextLevelThreshold || !currentLevelThreshold) return null;

  const xpForCurrentLevel = currentXP - currentLevelThreshold.min_experience;
  const xpRequiredForNextLevel =
    nextLevelThreshold.min_experience - currentLevelThreshold.min_experience;
  const progressPercentage = (xpForCurrentLevel / xpRequiredForNextLevel) * 100;

  return (
    <View className="rounded-xl bg-white p-4 shadow-md">
      {/* User Info */}
      <View className="mb-4 flex-row items-center">
        <Image
          source={{
            uri: userInfo.profile_picture_url || 'https://via.placeholder.com/100',
          }}
          className="h-20 w-20 rounded-full"
        />
        <View className="flex-row items-center">
          <View className="ml-3">
            <Text className="text-lg font-bold">{userInfo.username || 'Student'}</Text>
            <Text className="text-sm text-gray-500">{userInfo.email}</Text>
          </View>
          <View className="ml-3 flex-row items-center border-l border-gray-400 pl-3">
            <Text className="ml-11 text-4xl">{userInfo.country?.flag_icon || '🌏'}</Text>
          </View>
        </View>
      </View>

      {/* Level Progress */}
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
    </View>
  );
};
