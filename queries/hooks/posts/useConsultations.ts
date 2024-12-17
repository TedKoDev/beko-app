import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/queries/queryClient';
import { getConsultationsApi, getConsultationByIdApi } from '~/services/postService';
import { useAuthStore } from '~/store/authStore';
import { ConsultationFilters } from '~/types/consultation';

export const useConsultations = (filters: ConsultationFilters) => {
  const token = useAuthStore((state) => state.userToken);

  return useInfiniteQuery({
    queryKey: ['ssconsultations', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getConsultationsApi({
        page: pageParam,
        limit: 10, // 페이지당 항목 수를 고정
        ...filters, // 필터링 조건 전달
      });

      return {
        ...response,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / 10); // 전체 페이지 수 계산
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined; // 마지막 페이지면 undefined 반환
    },
    enabled: !!token, // 토큰이 있어야 쿼리 실행
    initialPageParam: 1, // 첫 페이지 초기값 설정
  });
};

export function useConsultationById(id: number) {
  return useQuery({
    queryKey: ['consultation', id],
    queryFn: () => getConsultationByIdApi(id),
    enabled: !!id,
  });
}

export function useMyConsultations(params: {
  page: number;
  limit: number;
  filters: ConsultationFilters;
}) {
  const userInfo = useAuthStore((state) => state.userInfo);

  return useInfiniteQuery({
    queryKey: ['myConsultations', params],
    queryFn: ({ pageParam = 1 }) =>
      getConsultationsApi({
        page: pageParam,
        limit: params.limit,
        ...params.filters,
      }),
    enabled: !!userInfo?.user_id,

    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === params.limit ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
