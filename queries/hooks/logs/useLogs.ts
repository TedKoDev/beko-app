import { useQuery } from '@tanstack/react-query';

import { getlogsApi, logsParams } from '~/services/logsService';
import { useAuthStore } from '~/store/authStore';

export const useLogs = (params?: logsParams) => {
  const token = useAuthStore((state) => state.userToken);
  return useQuery({
    queryKey: ['logs', params?.type],
    queryFn: () => getlogsApi(params),

    staleTime: 1000 * 60 * 5, // 5분간 데이터가 신선하다고 간주
    refetchOnWindowFocus: false,
    enabled: !!token,
  });
};
