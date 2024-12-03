import { api } from './api';
import { useAuthStore } from '../store/authStore';

import { SubmitAnswerDto } from '~/types/game';

export const gameService = {
  // 게임 타입 목록 조회
  getGameTypes: async () => {
    const token = useAuthStore.getState().userToken;
    const response = await api.get('/games/types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 게임 진행상황 조회
  getGameProgress: async (gameTypeId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get(`/games/progress`, {
      params: { gameTypeId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 게임 문제 조회
  getQuestions: async (gameTypeId: number, level: number = 1, limit: number = 10) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get(`/games/questions`, {
      params: { gameTypeId, level, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 답안 제출
  submitAnswer: async (gameTypeId: number, submitAnswerDto: SubmitAnswerDto) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post(`/games/submit`, submitAnswerDto, {
      params: { gameTypeId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};
