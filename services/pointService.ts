import { api } from './api';

import { useAuthStore } from '~/store/authStore';
import { PointHistoryResponse } from '~/types/point';

export const pointService = {
  // 포인트 내역 조회
  getPointHistory: async (userId: number, page: number = 1, limit: number = 20) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get<PointHistoryResponse>(`/points/${userId}`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 포인트 적립/사용
  createPoint: async (
    userId: number,
    data: { points: number; type: string; description: string }
  ) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post(`/points/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
