import { api } from './api';

import { useAuthStore } from '~/store/authStore';

interface SearchResponse {
  postsByContent: any[];
  postsByTag: any[];
  users: any[];
}

interface PopularSearchDto {
  keyword: string;
  currentRank: number;
  previousRank?: number;
  rankChange: 'UP' | 'DOWN' | 'NEW' | 'SAME';
  rankDifference?: number;
  checkTime: Date;
}
interface SearchQueryDto {
  query: string;
  page: number;
  limit: number;
}

export const searchService = {
  // 통합 검색
  search: async (params: SearchQueryDto): Promise<SearchResponse> => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/search', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 게시글 검색
  searchPosts: async (params: SearchQueryDto) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/search/posts', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 태그로 게시글 검색
  searchPostsByTag: async (params: SearchQueryDto) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/search/posts/tag', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 유저 검색
  searchUsers: async (params: SearchQueryDto) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/search/users', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 인기 검색어 조회
  getPopularSearches: async (): Promise<PopularSearchDto[]> => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/popular-search', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
