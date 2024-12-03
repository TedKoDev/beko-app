export interface LevelThreshold {
  level: number;
  min_experience: number;
}

export interface UserLevelInfo {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
  progress: number;
}
