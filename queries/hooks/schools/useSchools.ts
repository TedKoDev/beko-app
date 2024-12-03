import { useInfiniteQuery } from '@tanstack/react-query';

import { schoolService } from '~/services/schoolService';

export const useGetSchools = () => {
  return useInfiniteQuery({
    queryKey: ['schools'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => schoolService.getSchools({ page: pageParam }),
    getNextPageParam: (lastPage: { meta: { page: number; totalPages: number } }) => {
      const { page, totalPages } = lastPage.meta;
      if (page < totalPages) return page + 1;
      return undefined;
    },
  });
};
