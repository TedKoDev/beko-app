export interface GameType {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  type: GameCategory;
  currentLevel?: number;
}

export interface GameProgress {
  currentLevel: number;
  totalScore: number;
  completedQuestions: number;
  gameTypeId: number;
}

export enum GameCategory {
  VOCABULARY = 'vocabulary',
  GRAMMAR = 'grammar',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
}

export interface Question {
  id: number;
  content: string;
  options: string[];
  level: number;
  type: GameCategory;
}

export interface SubmitAnswerDto {
  questionId: number;
  answer: string;
}
