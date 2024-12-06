import { useMutation } from '@tanstack/react-query';
import { reportTargetType } from '@prisma/client';
import { reportService } from '~/services/reportService';
import { Alert } from 'react-native';

interface UseReportParams {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useReport = ({ onSuccess, onError }: UseReportParams = {}) => {
  const createReportMutation = useMutation({
    mutationFn: reportService.createReport,
    onSuccess: (data) => {
      Alert.alert('Success', '신고가 접수되었습니다.');
      onSuccess?.();
    },
    onError: (error) => {
      Alert.alert('Error', '신고 접수에 실패했습니다. 다시 시도해주세요.');
      onError?.(error);
    },
  });

  const createReport = async ({
    targetType,
    targetId,
    reportedUserId,
    reason,
  }: {
    targetType: reportTargetType;
    targetId: number;
    reportedUserId: number;
    reason: string;
  }) => {
    console.log('createReport', targetType, targetId, reportedUserId, reason);
    try {
      await createReportMutation.mutateAsync({
        target_type: targetType,
        target_id: targetId,
        reported_user_id: reportedUserId,
        reason,
      });
    } catch (error) {
      console.error('Report error:', error);
    }
  };

  return {
    createReport,
    isLoading: createReportMutation.isPending,
  };
};
