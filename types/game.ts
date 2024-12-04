export interface BaseGame {
  id: number | string;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
}

export interface GameType extends BaseGame {
  id: number;
  level?: number;
}

export interface ComingSoonGame extends BaseGame {
  id: string;
  isComingSoon: true;
}

export type GameCardType = GameType | ComingSoonGame;

export interface GameProgress {
  gameTypeId: number;
  currentLevel: number;
  totalScore: number;
  completedQuestions: number;
  experience: number;
}

export interface Question {
  id: number;
  content: string;
  options: string[];
  level: number;
  type: string;
}

export interface SubmitAnswerDto {
  questionId: number;
  answer: string;
}

export interface LeaderboardEntry {
  userId: number;
  username: string;
  score: number;
  rank: number;
}

export interface GameTypeResponse {
  game_type_id: number;
  name: string;
  description: string;
}
