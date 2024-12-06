import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { searchService } from '~/services/searchService';

export const useSearch = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchService.search({ query, limit }),
    enabled: !!query,
  });
};

export const useSearchPosts = (query: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['searchPosts', query],
    queryFn: ({ pageParam = 1 }) => searchService.searchPosts({ query, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < limit) return undefined;
      return lastPage.page + 1;
    },
    enabled: !!query,
  });
};

export const useSearchPostsByTag = (query: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['searchPostsByTag', query],
    queryFn: ({ pageParam = 1 }) =>
      searchService.searchPostsByTag({ query, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < limit) return undefined;
      return lastPage.page + 1;
    },
    enabled: !!query,
  });
};

export const useSearchUsers = (query: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['searchUsers', query],
    queryFn: ({ pageParam = 1 }) => searchService.searchUsers({ query, page: pageParam, limit }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < limit) return undefined;
      return lastPage.page + 1;
    },
    enabled: !!query,
  });
};

export const usePopularSearches = () => {
  return useQuery({
    queryKey: ['popularSearches'],
    queryFn: searchService.getPopularSearches,
  });
};
