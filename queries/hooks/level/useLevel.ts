import { useMutation, useQuery } from '@tanstack/react-query';
import { levelService } from '~/services/levelService';
import { LevelThreshold, UserLevelInfo } from '~/types/level';

export const useLevelThresholds = () => {
  return useQuery<LevelThreshold[]>({
    queryKey: ['levelThresholds'],
    queryFn: () => levelService.getAllThresholds(),
  });
};

export const useLevelThreshold = (level: number) => {
  return useQuery<LevelThreshold>({
    queryKey: ['levelThreshold', level],
    queryFn: () => levelService.getThresholdByLevel(level),
    enabled: !!level,
  });
};

export const useUserLevelInfo = () => {
  return useQuery<UserLevelInfo>({
    queryKey: ['userLevelInfo'],
    queryFn: () => levelService.getUserLevelInfo(),
  });
};

export const useCreateOrUpdateThreshold = () => {
  return useMutation({
    mutationFn: ({ level, minExperience }: { level: number; minExperience: number }) =>
      levelService.createOrUpdateThreshold(level, minExperience),
  });
};

export const useDeleteThreshold = () => {
  return useMutation({
    mutationFn: (level: number) => levelService.deleteThreshold(level),
  });
};
