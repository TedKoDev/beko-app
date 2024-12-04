import { api } from './api';
import { useAuthStore } from '../store/authStore';
import { LevelThreshold, UserLevelInfo } from '~/types/level';

export const levelService = {
  getAllThresholds: async () => {
    const token = useAuthStore.getState().userToken;
    const response = await api.get<LevelThreshold[]>('/level', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 특정 레벨 기준 조회
  getThresholdByLevel: async (level: number) => {
    const token = useAuthStore.getState().userToken;
    const response = await api.get<LevelThreshold>(`/level/${level}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 사용자 레벨 정보 조회
  getUserLevelInfo: async () => {
    const token = useAuthStore.getState().userToken;
    const response = await api.get<UserLevelInfo>('/level/user/info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 레벨 기준 생성/수정 (관리자용)
  createOrUpdateThreshold: async (level: number, minExperience: number) => {
    const token = useAuthStore.getState().userToken;
    const response = await api.post<LevelThreshold>(
      '/level',
      { level, min_experience: minExperience },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  // 레벨 기준 삭제 (관리자용)
  deleteThreshold: async (level: number) => {
    const token = useAuthStore.getState().userToken;
    const response = await api.delete(`/level/${level}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
