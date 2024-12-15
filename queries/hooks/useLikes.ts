import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likeService } from '~/services/likeService';

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likeService.togglePostLike(postId),
    onSuccess: (response, postId) => {
      // 개별 게시글 캐시 업데이트
      queryClient.setQueryData(['post', postId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          user_liked: !oldData.user_liked,
          likes: oldData.user_liked ? oldData.likes - 1 : oldData.likes + 1,
        };
      });

      // posts 쿼리 캐시 업데이트 (feed 페이지)
      queryClient.setQueryData(['posts'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post.post_id === postId
                ? {
                    ...post,
                    user_liked: !post.user_liked,
                    likes: post.user_liked ? post.likes - 1 : post.likes + 1,
                  }
                : post
            ),
          })),
        };
      });

      // events, belaPick 쿼리 캐시 업데이트
      ['events', 'belaPick'].forEach((queryKey) => {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post.post_id === postId
                  ? {
                      ...post,
                      user_liked: !post.user_liked,
                      likes: post.user_liked ? post.likes - 1 : post.likes + 1,
                    }
                  : post
              ),
            })),
          };
        });
      });
    },
    onError: (error) => {
      console.error('Toggle post like error:', error);
    },
  });
};

export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => likeService.toggleCommentLike(commentId),
    onSuccess: (_, commentId) => {
      // comments 쿼리의 모든 데이터를 가져옵니다
      const queries = queryClient.getQueriesData<any>({ queryKey: ['comments'] });

      // 각 comments 쿼리에 대해 좋아요 상태를 업데이트합니다
      for (const [queryKey, data] of queries) {
        if (data?.pages) {
          queryClient.setQueryData(queryKey, {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              data: page.data.map((comment: any) => {
                if (comment.comment_id === commentId) {
                  return {
                    ...comment,
                    user_liked: !comment.user_liked,
                    likes: comment.user_liked ? comment.likes - 1 : comment.likes + 1,
                  };
                }
                return comment;
              }),
            })),
          });
        }
      }
    },
    onError: (error) => {
      console.error('Toggle comment like error:', error);
    },
  });
};
