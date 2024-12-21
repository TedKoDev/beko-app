import { useQuery, useQueryClient } from '@tanstack/react-query';

import { healthCheckApi } from '~/services/authService';

export const useHealthcheck = () => {
  //console.log('useHealthcheck');
  const { data, isLoading, error } = useQuery({
    queryKey: ['healthcheck'],
    queryFn: healthCheckApi,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  return { data, isLoading, error };
};
