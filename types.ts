
export interface MorseCodeMap {
  char: string;
  morse: string;
  mnemonic: string;
  category: 'letters' | 'numbers' | 'punctuation';
}

export interface CharacterSet {
  id: 'letters' | 'numbers' | 'punctuation';
  name: string;
  characters: string[];
}

export interface Settings {
  soundEnabled: boolean;
  isProMode: boolean;
  playbackSpeed: number; // dot duration in ms
}

export interface CharacterProgress {
  attempts: number;
  correct: number;
}

export type ProgressData = {
  [key: string]: CharacterProgress;
};

export enum AppView {
  Learn = 'learn',
  Quiz = 'quiz',
  Reference = 'reference',
  Progress = 'progress',
}

export enum QuizMode {
  LetterToMorse = 'LetterToMorse',
  MorseToLetter = 'MorseToLetter',
  TypeItOut = 'TypeItOut',
}

export interface QuizQuestion {
  id: string; // Typically the character itself
  character: string;
  morse: string;
  mnemonic: string;
  mode: QuizMode;
  options?: string[]; // For MCQ mode (either characters or morse codes)
}

export interface SnackbarMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
