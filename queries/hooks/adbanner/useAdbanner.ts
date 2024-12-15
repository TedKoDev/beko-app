// hooks/useAdbanner.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { adbannerSerive, PaginationQueryDto } from '~/services/adbannerSerive';

export const useAdbanner = (params: Partial<PaginationQueryDto> = {}) => {
  return useInfiniteQuery({
    queryKey: ['adBanners', params],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      adbannerSerive.fetchAdBanners({
        page: pageParam,
        limit: params.limit ?? 10,
        sort: params.sort ?? 'latest',
        search: params.search,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < (params.limit ?? 10)) {
        return undefined;
      }
      return allPages.length + 1;
    },
    staleTime: 30 * 1000,
    // gcTime: 5 * 60 * 1000,
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
  });
};
