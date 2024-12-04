import { create } from 'zustand';

import { LevelThreshold, UserLevelInfo } from '~/types/level';

interface LevelStore {
  levelInfo: UserLevelInfo | null;
  thresholds: LevelThreshold[] | null;
  setLevelInfo: (info: UserLevelInfo) => void;
  setThresholds: (thresholds: LevelThreshold[]) => void;
}

export const useLevelStore = create<LevelStore>((set) => ({
  levelInfo: null,
  thresholds: null,
  setLevelInfo: (info) => set({ levelInfo: info }),
  setThresholds: (thresholds) => set({ thresholds }),
}));
