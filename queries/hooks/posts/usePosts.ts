import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';

import { queryClient } from '~/queries/queryClient';
import {
  addPostApi,
  CreatePostDto,
  getConsultationByIdApi,
  getConsultationsApi,
  getPostApi,
  getPostByIdApi,
  postService,
  UpdatePostDto,
} from '~/services/postService';
import { useAuthStore } from '~/store/authStore';

interface Post {
  post_id: number;
  categoryId?: number;
  title?: string;
  content: string;
  points?: number;
  type: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  // 기타 필요한 필드
}

type UsePostsParams = {
  page: number;
  limit: number;
  sort: 'latest' | 'oldest' | 'popular';
  type?: string;
  admin_pick?: boolean;
  topicId?: number;
  categoryId?: number;
  check_id?: number;
};

export function usePosts(params: UsePostsParams) {
  const token = useAuthStore((state) => state.userToken);
  return useInfiniteQuery({
    queryKey: ['posts', params],
    queryFn: ({ pageParam = 1 }) =>
      getPostApi({
        page: pageParam,
        limit: params.limit,
        sort: params.sort,
        check_id: params.check_id,
        type: params.type,
        admin_pick: params.admin_pick,
        topic_id: params.topicId,
        category_id: params.categoryId,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === params.limit ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!token,
  });
}
export function useGetPostById(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostByIdApi(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
  });
}

export function useAddPost() {
  return useMutation<Post, Error, CreatePostDto>({
    mutationFn: (data: CreatePostDto) => addPostApi(data),

    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistic update
      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old?.pages?.[0]) return old;

        const optimisticPost = {
          post_id: Date.now(),
          ...newPost,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [optimisticPost, ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousPosts };
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'], exact: true }),
        queryClient.invalidateQueries({ queryKey: ['myConsultations'] }),
        queryClient.refetchQueries({ queryKey: ['myConsultations'] }),
        queryClient.invalidateQueries({ queryKey: ['ssconsultations'] }),
        queryClient.refetchQueries({ queryKey: ['ssconsultations'] }),
      ]);
    },
  });
}

// Update Post Hook
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, ...updateData }: UpdatePostDto & { postId: number }) =>
      postService.updatePost(postId, updateData),
    onSuccess: async (_, variables) => {
      // 1. 이미지 캐시 클리어
      await Image.clearMemoryCache();
      await Image.clearDiskCache();

      // 2. 쿼리 무효화 및 리프레시
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['post', variables.postId] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['post', variables.postId] }),
        queryClient.invalidateQueries({ queryKey: ['consultations'] }),
        queryClient.refetchQueries({ queryKey: ['consultations'] }),

        queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] }),
        queryClient.refetchQueries({ queryKey: ['comments', variables.postId] }),
        // queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.refetchQueries({ queryKey: ['logs'] }),
        // queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'] }),
      ]);
    },
    onError: (error) => {
      console.error('Update post failed:', error);
    },
  });
};

export const useUpdateConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, ...updateData }: UpdatePostDto & { postId: number }) =>
      postService.updatePost(postId, updateData),
    onSuccess: async (_, variables) => {
      await Image.clearMemoryCache();
      await Image.clearDiskCache();

      // 일반 post와 동일한 패턴으로 변경
      await Promise.all([
        //console.log('ssconsultationsinvalidateQueries'),
        queryClient.invalidateQueries({
          queryKey: ['ssconsultations'],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ['consultation', variables.postId],
          exact: true,
        }),
        //console.log('ssconsultationsrefetchQueries'),
        queryClient.refetchQueries({
          queryKey: ['ssconsultations'],
          exact: true,
        }),
        queryClient.refetchQueries({
          queryKey: ['consultation', variables.postId],
          exact: true,
        }),
      ]);
    },
    onError: (error) => {
      console.error('Update consultation failed:', error);
    },
  });
};

// Delete Post Hook
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),
    onSuccess: async () => {
      // 모든 관련 쿼리 무효화 및 리프레시
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.refetchQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['logs'] }),
        queryClient.refetchQueries({ queryKey: ['logs'] }),
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }),
        queryClient.refetchQueries({ queryKey: ['userInfo'], exact: true }),
      ]);
    },
  });
};
