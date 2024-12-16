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
      return await wordListService.addToUserWordList(wordId, notes);
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['wordList'] }),
        queryClient.cancelQueries({ queryKey: ['userWordList'] }),
      ]);

      const previousWordList = queryClient.getQueryData(['wordList']);
      const previousUserWordList = queryClient.getQueryData(['userWordList']);

      // 낙관적 업데이트
      queryClient.setQueriesData({ queryKey: ['wordList'] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages?.map((page: any) => ({
            ...page,
            wordList: page.wordList?.map((word: any) =>
              word.word_id === wordId ? { ...word, isInUserWordList: !word.isInUserWordList } : word
            ),
          })),
        };
      });

      return { previousWordList, previousUserWordList };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousWordList) {
        queryClient.setQueryData(['wordList'], context.previousWordList);
      }
      if (context?.previousUserWordList) {
        queryClient.setQueryData(['userWordList'], context.previousUserWordList);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wordList'] });
      queryClient.invalidateQueries({ queryKey: ['userWordList'] });
    },
  });
};

// 사용자 단어 메모 업데이트
export const useUpdateUserWordNotes = (wordId: number, notes: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wordListService.updateUserWord(wordId, notes),
    onMutate: async () => {
      // 기존 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['userWordList'] });

      // 기존 데이터 백업
      const previousData = queryClient.getQueryData(['userWordList']);

      // 낙관적 업데이트
      queryClient.setQueryData(['userWordList'], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            ...Object.fromEntries(
              Object.entries(page).map(([key, value]: [string, any]) => {
                if (value?.word?.word_id === wordId) {
                  return [key, { ...value, notes }];
                }
                return [key, value];
              })
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context: any) => {
      // 에러 시 롤백
      if (context?.previousData) {
        queryClient.setQueryData(['userWordList'], context.previousData);
      }
    },
    onSettled: () => {
      // 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['userWordList'] });
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

export const useGetUserWordList = () => {
  const token = useAuthStore((state) => state.userToken);
  return useInfiniteQuery({
    queryKey: ['userWordList'],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      const response = await wordListService.getUserWordList(page, 10);
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

export const useUpdateWordInUserWordList = (wordId: number, notes: string) => {
  return useMutation({
    mutationFn: () => wordListService.updateUserWord(wordId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWordList'] });
      queryClient.refetchQueries({ queryKey: ['userWordList'] });
      queryClient.refetchQueries({ queryKey: ['wordList'] });
      queryClient.invalidateQueries({ queryKey: ['wordList'] });
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
