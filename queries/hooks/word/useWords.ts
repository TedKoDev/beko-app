import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';

import { queryClient } from '~/queries/queryClient';
import { getWordApi, getWordListApi, wordListService, wordService } from '~/services/wordService';
import { useAuthStore } from '~/store/authStore';

export interface Word {
  word_id: number;
  word: string;
  meaning_en: string;
  example_sentence: string;
  example_translation: string;
  part_of_speech: string;
  isInUserWordList: boolean;
  userNotes: string | null;
  addedToUserWordListAt: string | null;
}

interface WordListPage {
  wordList: Word[];
  totalCount: number;
  page: number;
}

export function useWords() {
  const token = useAuthStore((state) => state.userToken);

  return useQuery<Word[], Error>({
    queryKey: ['todayWords'],
    queryFn: () => getWordApi(),
    enabled: !!token,
    onSuccess: (data: Word[]) => {
      console.log('API 응답:', data);
    },
    onError: (error: any) => {
      console.error('API 에러:', error);
    },
  } as UseQueryOptions<Word[], Error>);
}

export const useWordList = () => {
  const token = useAuthStore((state) => state.userToken);

  return useInfiniteQuery<WordListPage>({
    queryKey: ['wordList'],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      const response = await wordListService.getWordList(page, 20);
      return {
        ...response,
        page,
      };
    },
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / 20);
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!token,
    initialPageParam: 1,
  });
};

export const useAddWordToUserWordList = (wordId: number, notes?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // console.log('Toggling word in list - mutationFn:', wordId);
      return await wordListService.addToUserWordList(wordId, notes);
    },
    onMutate: async () => {
      // console.log('onMutate started - wordId:', wordId);

      await queryClient.cancelQueries({ queryKey: ['wordList'] });

      const queryData = queryClient.getQueriesData({ queryKey: ['wordList'] });
      console.log('Query data found:', queryData);

      queryClient.setQueriesData({ queryKey: ['wordList'] }, (oldData: any) => {
        if (!oldData) return oldData;

        console.log('Updating data for word:', wordId);
        return {
          ...oldData,
          pages: oldData.pages?.map((page: any) => ({
            ...page,
            wordList: page.wordList.map((word: any) =>
              word.word_id === wordId ? { ...word, isInUserWordList: !word.isInUserWordList } : word
            ),
          })),
        };
      });

      return { queryData };
    },
    onError: (err, variables, context: any) => {
      console.log('onError triggered:', err);
      if (context?.queryData) {
        queryClient.setQueriesData({ queryKey: ['wordList'] }, context.queryData);
      }
    },
    onSuccess: (data) => {
      console.log('onSuccess triggered:', data);
    },
    onSettled: () => {
      console.log('onSettled triggered');
      queryClient.invalidateQueries({ queryKey: ['wordList'] });
    },
  });
};

export const useCreateNewWord = () => {
  return useMutation({
    mutationFn: (wordData: Word) => wordListService.createNewWord(wordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wordList'] });
    },
    onError: (error: Error) => {
      console.error('단어 추가 실패:', error);
    },
  });
};

export const useGetUserWordList = (page: number, limit: number = 10) => {
  const token = useAuthStore((state) => state.userToken);
  return useInfiniteQuery({
    queryKey: ['userWordList'],
    queryFn: ({ pageParam = 1 }) => wordListService.getUserWordList(pageParam, limit),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.data.length < limit) return undefined;
      return lastPage.page + 1;
    },
    enabled: !!token,
    initialPageParam: 1,
  });
};

export const useUpdateWordInUserWordList = (wordId: number, notes: string) => {
  return useMutation({
    mutationFn: () => wordListService.updateUserWord(wordId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWordList'] });
    },
    onError: (error: Error) => {
      console.error('단어 업데이트 실패:', error);
    },
  });
};

export const useSearchWords = (keyword: string, page: number, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['searchWords'],
    queryFn: ({ pageParam = 1 }) => wordListService.searchWords(keyword, pageParam, limit),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.data.length < limit) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
  });
};
