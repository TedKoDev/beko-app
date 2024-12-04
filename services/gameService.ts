import { api } from './api';
import { useAuthStore } from '../store/authStore';
import { GameType, GameProgress, SubmitAnswerDto } from '~/types/game';

export const gameService = {
  // 게임 종류 목록 조회
  getGameTypes: async () => {
    const response = await api.get<GameType[]>('/games/types');
    return response.data;
  },
  // 게임 진행상황 조회
  getGameProgress: async (gameTypeId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.get<GameProgress>(`/games/progress`, {
      params: { gameTypeId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 모든 게임 진행상황 조회
  getAllGameProgress: async () => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.get<GameProgress[]>('/games/all-progress', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 게임 문제 조회
  getQuestions: async (gameTypeId: number, level: number = 1, limit: number = 10) => {
    console.log('gameTypeId', gameTypeId);
    console.log('level', level);
    console.log('limit', limit);

    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.get(`/games/questions`, {
      params: { gameTypeId, level, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 답안 제출
  submitAnswer: async (gameTypeId: number, submitAnswerDto: SubmitAnswerDto) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.post(`/games/submit`, submitAnswerDto, {
      params: { gameTypeId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 리더보드 조회
  getLeaderboard: async (gameTypeId: number) => {
    const response = await api.get(`/games/leaderboard`, {
      params: { gameTypeId },
    });
    return response.data;
  },

  // 게임 레벨 정보 조회
  //   @Get('types/:gameTypeId/levels')
  // @ApiOperation({ summary: '게임 레벨 정보 조회' })
  // @Auth(['ANY'])
  // async getGameLevelInfo(@Param('gameTypeId') gameTypeId: number) {
  //   return this.gamesService.getGameLevelInfo(gameTypeId);
  // }
  getGameLevelInfo: async (gameTypeId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.get(`/games/types/${gameTypeId}/levels`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
