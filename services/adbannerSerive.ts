import { useAuthStore } from '~/store/authStore';
import { api } from './api';
import axios from 'axios';

// types/pagination.ts
export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'latest' | 'oldest' | 'popular';
}

// services/adbannerSerive.ts

export const adbannerSerive = {
  async fetchAdBanners(params: PaginationQueryDto) {
    const token = useAuthStore.getState().userToken;
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      const response = await api.get('/ad-banners', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
      }
      throw error;
    }
  },
};
