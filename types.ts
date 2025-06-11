
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
  score?: number; // Optional: Points earned for this character (could be used for advanced mastery)
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

// Gamification Types
export type BadgeId = 
  | 'first_steps'          // Completed first quiz question correctly
  | 'letter_learner'       // Mastered 5 letters
  | 'letter_master'        // Mastered all letters
  | 'number_novice'        // Mastered 3 numbers
  | 'number_ace'           // Mastered all numbers
  | 'punctuation_pioneer'  // Mastered 3 punctuation marks
  | 'morse_initiate'       // Reached Level 2
  | 'morse_adept'          // Reached Level 5
  | 'morse_virtuoso'       // Reached Level 10
  | 'streak_starter_5'     // Achieved a 5-correct-answer streak in a quiz
  | 'streak_master_10'     // Achieved a 10-correct-answer streak in a quiz
  | 'daily_dabbler'        // Claimed daily bonus 1 time
  | 'consistent_coder'     // Claimed daily bonus 5 times
  | 'perfect_quiz_round'   // Completed a full quiz session (MAX_QUIZ_QUESTIONS) with no mistakes
  | 'quiz_warrior';        // Completed 10 quiz sessions

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  icon: React.ElementType; 
  condition: (progressData: ProgressData, userStats: UserStats, quizSessionStats?: QuizSessionStats) => boolean;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentQuizStreak: number; // Overall, for badges, not reset per session
  longestQuizStreak: number;
  lastActivityDate: string | null; // YYYY-MM-DD
  dailyBonusClaimedDate: string | null; // YYYY-MM-DD
  dailyBonusClaimsCount: number;
  earnedBadges: BadgeId[];
  completedQuizSessions: number;
}

export interface QuizSessionStats {
    questionsCorrect: number;
    questionsAttempted: number;
    mistakesMade: number;
}