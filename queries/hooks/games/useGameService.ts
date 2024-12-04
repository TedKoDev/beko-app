import { useMutation, useQuery } from '@tanstack/react-query';

import { gameService } from '~/services/gameService';

import { GameType, GameProgress, SubmitAnswerDto } from '~/types/game';

export const useGameTypes = () => {
  return useQuery<GameType[]>({
    queryKey: ['gameTypes'],
    queryFn: () => gameService.getGameTypes(),
  });
};

export const useGameProgress = (gameTypeId: number) => {
  return useQuery<GameProgress>({
    queryKey: ['gameProgress', gameTypeId],
    queryFn: () => gameService.getGameProgress(gameTypeId),
    enabled: !!gameTypeId,
  });
};

export const useAllGameProgress = () => {
  return useQuery<GameProgress[]>({
    queryKey: ['allGameProgress'],
    queryFn: () => gameService.getAllGameProgress(),
  });
};

export const useGameQuestions = (gameTypeId: number, level?: number, limit?: number) => {
  console.log('gameTypeId', gameTypeId);
  console.log('level', level);
  console.log('limit', limit);

  return useQuery({
    queryKey: ['gameQuestions', gameTypeId, level],
    queryFn: () => gameService.getQuestions(gameTypeId, level, limit),
    enabled: !!gameTypeId,
  });
};

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: ({
      gameTypeId,
      submitAnswerDto,
    }: {
      gameTypeId: number;
      submitAnswerDto: SubmitAnswerDto;
    }) => gameService.submitAnswer(gameTypeId, submitAnswerDto),
  });
};

export const useLeaderboard = (gameTypeId: number) => {
  return useQuery({
    queryKey: ['leaderboard', gameTypeId],
    queryFn: () => gameService.getLeaderboard(gameTypeId),
    enabled: !!gameTypeId,
  });
};

export const useGameLevelInfo = (gameTypeId: number) => {
  return useQuery({
    queryKey: ['gameLevelInfo', gameTypeId],
    queryFn: () => gameService.getGameLevelInfo(gameTypeId),
    enabled: !!gameTypeId,
  });
};
