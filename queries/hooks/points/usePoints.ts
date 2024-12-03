import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { pointService } from '~/services/pointService';

export const useGetPointHistory = (userId: number) => {
  return useInfiniteQuery({
    queryKey: ['pointHistory', userId],
    queryFn: ({ pageParam = 1 }) => pointService.getPointHistory(userId, pageParam),
    getNextPageParam: (lastPage: { page: number; total: number; limit: number }) => {
      const { page, total, limit } = lastPage;
      const maxPage = Math.ceil(total / limit);
      if (page < maxPage) return page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useCreatePoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      points,
      type,
      description,
    }: {
      userId: number;
      points: number;
      type: string;
      description: string;
    }) => {
      return pointService.createPoint(userId, { points, type, description });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['pointHistory', variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['userInfo'],
      });
    },
  });
};
