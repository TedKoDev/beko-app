import { api } from './api';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentCommentId?: number;
  media?: {
    media_url: string;
    media_type: string;
  }[];
}
export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'popular';
  postId?: number;
  userId?: number;
}

export const commentService = {
  // 댓글 생성
  createComment: async (data: CreateCommentRequest) => {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) {
        throw new Error('No token found');
      }

      //console.log('Request data:', data);
      const response = await api.post(
        '/comments',
        {
          postId: data.postId,
          content: data.content,
          parentCommentId: data.parentCommentId,
          media: data.media,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Create comment failed:', error);
      throw error;
    }
  },

  // 댓글 목록 조회
  getComments: async (queryDto: PaginationQueryDto) => {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) {
        throw new Error('No token found');
      }

      // undefined, null, 빈 문자열, NaN 체크를 포함한 파라미터 필터링
      const params = {
        ...(typeof queryDto.page === 'number' && { page: queryDto.page }),
        ...(typeof queryDto.limit === 'number' && { limit: queryDto.limit }),
        ...(queryDto.sort && { sort: queryDto.sort }),
        ...(typeof queryDto.postId === 'number' && { postId: queryDto.postId }),
        ...(queryDto.userId !== undefined &&
          queryDto.userId !== null &&
          !isNaN(Number(queryDto.userId)) && {
            userId: Number(queryDto.userId),
          }),
      };

      const response = await api.get('/comments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error in getComments:', error);
      throw error;
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId: number) => {
    //console.log('deleteComment', commentId);
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.delete(`/comments/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // 댓글 수정
  updateComment: async (commentId: number, content: string) => {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.patch(
      `/comments/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  selectAsAnswer: async (commentId: number) => {
    try {
      const token = useAuthStore.getState().userToken;
      if (!token) {
        throw new Error('No token found');
      }
      const response = await api.patch(
        `/comments/${commentId}/select-as-answer`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const answerConsultationApi = async (postId: number, content: string, commentId: number) => {
  //console.log('answerConsultationApi', postId, content, commentId);
  try {
    const token = useAuthStore.getState().userToken;
    const response = await api.post(
      `/comments/consultation/${postId}/answer`,
      { content, commentId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Answer consultation failed', error);
    throw error;
  }
};
