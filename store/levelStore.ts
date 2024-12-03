import { create } from 'zustand';
import { UserLevelInfo } from '~/types/level';

interface LevelStore {
  userLevelInfo: UserLevelInfo | null;
  setUserLevelInfo: (info: UserLevelInfo) => void;
  clearUserLevelInfo: () => void;
}

export const useLevelStore = create<LevelStore>((set) => ({
  userLevelInfo: null,
  setUserLevelInfo: (info) => set({ userLevelInfo: info }),
  clearUserLevelInfo: () => set({ userLevelInfo: null }),
}));
