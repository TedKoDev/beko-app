import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecentSearch {
  keyword: string;
  timestamp: number;
}

interface RecentSearchState {
  searches: RecentSearch[];
  addSearch: (keyword: string) => void;
  removeSearch: (keyword: string) => void;
  clearSearches: () => void;
}

export const useRecentSearchStore = create<RecentSearchState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (keyword) =>
        set((state) => ({
          searches: [
            { keyword, timestamp: Date.now() },
            ...state.searches.filter((s) => s.keyword !== keyword),
          ].slice(0, 10), // 최근 10개만 유지
        })),
      removeSearch: (keyword) =>
        set((state) => ({
          searches: state.searches.filter((s) => s.keyword !== keyword),
        })),
      clearSearches: () => set({ searches: [] }),
    }),
    {
      name: 'recent-searches',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
