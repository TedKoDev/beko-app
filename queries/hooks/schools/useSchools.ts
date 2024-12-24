import { useInfiniteQuery } from '@tanstack/react-query';

import { schoolService } from '~/services/schoolService';
import { PaginationParams } from '~/types/school';

export const useGetSchools = (paginationParams: PaginationParams) => {
  return useInfiniteQuery({
    queryKey: ['schools', paginationParams],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => schoolService.getSchools({ page: pageParam, ...paginationParams }),
    getNextPageParam: (lastPage: { meta: { page: number; totalPages: number } }) => {
      const { page, totalPages } = lastPage.meta;
      if (page < totalPages) return page + 1;
      return undefined;
    },
  });
};
