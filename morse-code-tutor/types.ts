
export interface MorseChar {
  char: string;
  code: string;
}

export enum QuizMode {
  LetterToMorse = 'LETTER_TO_MORSE',
  MorseToLetter = 'MORSE_TO_LETTER',
  TypeItOut = 'TYPE_IT_OUT',
}

export interface CharacterStats {
  correctAttempts: number;
  totalAttempts: number;
  mastered: boolean;
}

export type ProgressData = Record<string, CharacterStats>; // Key is the character

export enum AppView {
  Learn = 'LEARN', // New Rhythm Method view
  Quiz = 'QUIZ',
  Reference = 'REFERENCE',
  Progress = 'PROGRESS_VIEW',
}