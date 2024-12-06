import { reportTargetType } from '@prisma/client';
import { axiosInstance } from '~/lib/axios';
import { useAuthStore } from '~/store/authStore';
import { api } from './api';

interface CreateReportDto {
  target_type: reportTargetType;
  target_id: number;
  reported_user_id: number;
  reason: string;
}

interface ReportResponse {
  message: string;
  report: {
    id: number;
    target_type: reportTargetType;
    target_id: number;
    reported_user_id: number;
    reason: string;
    created_at: string;
  };
}

export const reportService = {
  createReport: async (data: CreateReportDto): Promise<ReportResponse> => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post('/report', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
