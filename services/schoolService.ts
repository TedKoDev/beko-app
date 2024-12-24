import { api } from './api';
import { School, SchoolsResponse, PaginationParams } from '~/types/school';
import { useAuthStore } from '~/store/authStore';

export const schoolService = {
  getSchools: async ({ page = 1, limit = 20, country_code, region }: PaginationParams = {}) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get<SchoolsResponse>(`/schools`, {
      params: {
        page,
        limit,
        country_code,
        region,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  createSchool: async (schoolData: Partial<School>) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post<School>(`/v1/schools`, schoolData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
