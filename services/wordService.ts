import { api } from './api';
import { useAuthStore } from '../store/authStore';

export const getWordApi = async () => {
  try {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/word/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get word failed', error);
    throw error;
  }
};

export const getDayPostApi = async () => {
  try {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.get('/word/day', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get day post failed', error);
    throw error;
  }
};

export const getWordListApi = async () => {
  try {
    const token = useAuthStore.getState().userToken;
    if (!token) {
      throw new Error('No token found');
    }
  } catch (error) {
    console.error('Get word list failed', error);
    throw error;
  }
};

interface WordResponse {
  word_id: number;
  word: string;
  meaning_en: string;
  example_sentence: string;
  example_translation: string;
  part_of_speech: string;
  isInUserWordList: boolean;
  userNotes: string | null;
  addedToUserWordListAt: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

interface WordListResponse {
  wordList: WordResponse[];
  totalCount: number;
}

export const wordListService = {
  getWordList: async (page = 1, limit = 20): Promise<WordListResponse> => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.get<WordListResponse>('/word/word-list', {
      params: {
        page,
        limit,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  // 사용자 단어장에 단어 추가
  addToUserWordList: async (word_id: number, notes?: string) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.post(
      '/word/user-word',
      { word_id, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  // 새 단어 생성
  createNewWord: async (wordData: {
    word: string;
    part_of_speech: string;
    meaning_en: string;
    example_sentence?: string;
    example_translation?: string;
    notes?: string;
  }) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.post('/word/new-word', wordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 사용자 단어 목록 가져오기
  getUserWordList: async (page = 1, limit = 20) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.get(`/word/user-words?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 사용자 단어장에서 단어 삭제
  removeFromUserWordList: async (wordId: number) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    const response = await api.delete(`/word/user-word/${wordId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 단어 검색
  searchWords: async (keyword: string, page = 1, limit = 20) => {
    const response = await api.get(`/word/search?keyword=${keyword}&page=${page}&limit=${limit}`);
    return response.data;
  },

  // 사용자 단어 노트 업데이트
  updateUserWord: async (wordId: number, notes?: string) => {
    const token = useAuthStore.getState().userToken;
    if (!token) throw new Error('No token found');

    //console.log('updateUserWord called with wordId:', wordId, 'notes:', notes);
    const response = await api.patch(
      `/word/user-word/${wordId}`,
      { notes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

export const wordService = {
  getWordApi,
  getDayPostApi,
};
