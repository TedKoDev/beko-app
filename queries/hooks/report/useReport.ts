import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { reportService } from '~/services/reportService';

interface UseReportParams {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useReport = ({ onSuccess, onError }: UseReportParams = {}) => {
  const createReportMutation = useMutation({
    mutationFn: reportService.createReport,
    onSuccess: (data) => {
      Alert.alert('Success', 'Reported successfully');
      onSuccess?.();
    },
    onError: (error) => {
      Alert.alert('Error', 'Report submission failed. Please try again.');
      onError?.(error);
    },
  });

  const createReport = async ({
    targetType,
    targetId,
    reportedUserId,
    reason,
  }: {
    targetType: string;
    targetId: number;
    reportedUserId: number;
    reason: string;
  }) => {
    //console.log('createReport', targetType, targetId, reportedUserId, reason);
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
