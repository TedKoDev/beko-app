import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LevelProgressBar } from '~/components/level/LevelProgressBar';
import { useUserLevelInfo } from '~/queries/hooks/level/useLevel';

interface UserProfileCardProps {
  profileUrl?: string;
  username?: string;
  email?: string;
  countryFlag?: string;
  onEditPress?: () => void;
}

export const UserProfileCard = ({
  profileUrl,
  username = 'Student',
  email,
  countryFlag = '🌏',
  onEditPress,
}: UserProfileCardProps) => {
  const { data: levelInfo } = useUserLevelInfo();

  return (
    <Surface className="mb-4 overflow-hidden bg-white">
      <View className="bg-[#7b33ff] px-4 pb-8 pt-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={{
                uri: profileUrl || 'https://via.placeholder.com/100',
              }}
              className="h-16 w-16 rounded-full border-2 border-white"
            />
            <View className="ml-3">
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-white">{username}</Text>
                <Text className="ml-2 text-base text-white">{countryFlag}</Text>
              </View>
              <Text className="text-sm text-white/80">{email}</Text>
            </View>
          </View>
          {onEditPress && (
            <TouchableOpacity onPress={onEditPress} className="rounded-full bg-white/20 p-2">
              <MaterialCommunityIcons name="pencil" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="px-4 py-3">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <Text className="ml-2 text-lg font-bold">Level {levelInfo?.currentLevel || 1}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="trophy" size={20} color="#7b33ff" />
            <Text className="ml-1 text-sm text-gray-600">
              상위 {Math.round(((levelInfo?.currentLevel || 1) / 20) * 100)}%
            </Text>
          </View>
        </View>
        <LevelProgressBar compact />
      </View>
    </Surface>
  );
};
