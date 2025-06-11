
import { MorseCodeMap, CharacterSet, CharacterProgress, Settings, UserStats, BadgeDefinition, ProgressData, QuizSessionStats } from './types';
import AwardIcon from './components/icons/AwardIcon'; // Placeholder, will create this
import StarIcon from './components/icons/StarIcon';   // Placeholder
import FlameIcon from './components/icons/FlameIcon'; // Placeholder

export const MORSE_CODE_MAP: MorseCodeMap[] = [
  // Letters
  { char: 'A', morse: '.-', mnemonic: 'Alpha', category: 'letters' },
  { char: 'B', morse: '-...', mnemonic: 'Bravo', category: 'letters' },
  { char: 'C', morse: '-.-.', mnemonic: 'Charlie', category: 'letters' },
  { char: 'D', morse: '-..', mnemonic: 'Delta', category: 'letters' },
  { char: 'E', morse: '.', mnemonic: 'Echo', category: 'letters' },
  { char: 'F', morse: '..-.', mnemonic: 'Foxtrot', category: 'letters' },
  { char: 'G', morse: '--.', mnemonic: 'Golf', category: 'letters' },
  { char: 'H', morse: '....', mnemonic: 'Hotel', category: 'letters' },
  { char: 'I', morse: '..', mnemonic: 'India', category: 'letters' },
  { char: 'J', morse: '.---', mnemonic: 'Juliet', category: 'letters' },
  { char: 'K', morse: '-.-', mnemonic: 'Kilo', category: 'letters' },
  { char: 'L', morse: '.-..', mnemonic: 'Lima', category: 'letters' },
  { char: 'M', morse: '--', mnemonic: 'Mike', category: 'letters' },
  { char: 'N', morse: '-.', mnemonic: 'November', category: 'letters' },
  { char: 'O', morse: '---', mnemonic: 'Oscar', category: 'letters' },
  { char: 'P', morse: '.--.', mnemonic: 'Papa', category: 'letters' },
  { char: 'Q', morse: '--.-', mnemonic: 'Quebec', category: 'letters' },
  { char: 'R', morse: '.-.', mnemonic: 'Romeo', category: 'letters' },
  { char: 'S', morse: '...', mnemonic: 'Sierra', category: 'letters' },
  { char: 'T', morse: '-', mnemonic: 'Tango', category: 'letters' },
  { char: 'U', morse: '..-', mnemonic: 'Uniform', category: 'letters' },
  { char: 'V', morse: '...-', mnemonic: 'Victor', category: 'letters' },
  { char: 'W', morse: '.--', mnemonic: 'Whiskey', category: 'letters' },
  { char: 'X', morse: '-..-', mnemonic: 'X-ray', category: 'letters' },
  { char: 'Y', morse: '-.--', mnemonic: 'Yankee', category: 'letters' },
  { char: 'Z', morse: '--..', mnemonic: 'Zulu', category: 'letters' },
  // Numbers
  { char: '0', morse: '-----', mnemonic: 'Zero', category: 'numbers' },
  { char: '1', morse: '.----', mnemonic: 'One', category: 'numbers' },
  { char: '2', morse: '..---', mnemonic: 'Two', category: 'numbers' },
  { char: '3', morse: '...--', mnemonic: 'Three', category: 'numbers' },
  { char: '4', morse: '....-', mnemonic: 'Four', category: 'numbers' },
  { char: '5', morse: '.....', mnemonic: 'Five', category: 'numbers' },
  { char: '6', morse: '-....', mnemonic: 'Six', category: 'numbers' },
  { char: '7', morse: '--...', mnemonic: 'Seven', category: 'numbers' },
  { char: '8', morse: '---..', mnemonic: 'Eight', category: 'numbers' },
  { char: '9', morse: '----.', mnemonic: 'Nine', category: 'numbers' },
  // Punctuation
  { char: '.', morse: '.-.-.-', mnemonic: 'Period', category: 'punctuation' },
  { char: ',', morse: '--..--', mnemonic: 'Comma', category: 'punctuation' },
  { char: '?', morse: '..--..', mnemonic: 'Question Mark', category: 'punctuation' },
  { char: "'", morse: '.----.', mnemonic: 'Apostrophe', category: 'punctuation' },
  { char: '!', morse: '-.-.--', mnemonic: 'Exclamation Mark', category: 'punctuation' },
  { char: '/', morse: '-..-.', mnemonic: 'Slash', category: 'punctuation' },
  { char: '(', morse: '-.--.', mnemonic: 'Parenthesis Open', category: 'punctuation' },
  { char: ')', morse: '-.--.-', mnemonic: 'Parenthesis Close', category: 'punctuation' },
  { char: '&', morse: '.-...', mnemonic: 'Ampersand', category: 'punctuation' },
  { char: ':', morse: '---...', mnemonic: 'Colon', category: 'punctuation' },
  { char: ';', morse: '-.-.-.', mnemonic: 'Semicolon', category: 'punctuation' },
  { char: '=', morse: '-...-', mnemonic: 'Equals', category: 'punctuation' },
  { char: '+', morse: '.-.-.', mnemonic: 'Plus', category: 'punctuation' },
  { char: '-', morse: '-....-', mnemonic: 'Hyphen', category: 'punctuation' },
  { char: '_', morse: '..--.-', mnemonic: 'Underscore', category: 'punctuation' },
  { char: '"', morse: '.-..-.', mnemonic: 'Quotation Mark', category: 'punctuation' },
  { char: '$', morse: '...-..-', mnemonic: 'Dollar Sign', category: 'punctuation' },
  { char: '@', morse: '.--.-.', mnemonic: 'At Sign', category: 'punctuation' },
];

export const CHARACTER_SETS: CharacterSet[] = [
  { id: 'letters', name: 'Letters', characters: MORSE_CODE_MAP.filter(c => c.category === 'letters').map(c => c.char) },
  { id: 'numbers', name: 'Numbers', characters: MORSE_CODE_MAP.filter(c => c.category === 'numbers').map(c => c.char) },
  { id: 'punctuation', name: 'Punctuation', characters: MORSE_CODE_MAP.filter(c => c.category === 'punctuation').map(c => c.char) },
];

export const ALL_CHARACTERS: string[] = MORSE_CODE_MAP.map(item => item.char);

export const INITIAL_PROGRESS: { [key: string]: CharacterProgress } = ALL_CHARACTERS.reduce((acc, char) => {
  acc[char] = { attempts: 0, correct: 0, score: 0 };
  return acc;
}, {} as { [key: string]: CharacterProgress });

export const INITIAL_SETTINGS: Settings = {
  soundEnabled: true,
  isProMode: false,
  playbackSpeed: 100, // Base unit duration in ms (dot duration)
};

export const MASTERY_THRESHOLD_CORRECT = 5; // Minimum correct answers
export const MASTERY_THRESHOLD_PERCENT = 0.8; // 80% correct rate

export const DEFAULT_PLAYBACK_SPEED = 100; // ms for a dot
export const PRO_MODE_PLAYBACK_SPEED = 60; // ms for a dot (faster)

export const QUIZ_OPTIONS_COUNT = 4;
export const MAX_QUIZ_QUESTIONS = 10;

// Gamification Constants
export const INITIAL_USER_STATS: UserStats = {
  totalXP: 0,
  level: 1,
  currentQuizStreak: 0,
  longestQuizStreak: 0,
  lastActivityDate: null,
  dailyBonusClaimedDate: null,
  dailyBonusClaimsCount: 0,
  earnedBadges: [],
  completedQuizSessions: 0,
};

export const XP_PER_CORRECT_ANSWER = 10;
export const XP_STREAK_BONUS_MULTIPLIER = 2; // e.g., for 3rd correct answer in a row, + (3 * 2) bonus XP
export const XP_DAILY_BONUS = 50;
export const XP_BASE_FOR_LEVEL_UP = 100; // XP for level 1 to 2 = 100, for 2 to 3 = 200, etc. (level * base)
export const MAX_QUIZ_LIVES = 3;

export const LEVEL_UP_SOUND_MORSE = '.-.. ..-'; // "LU"
export const BADGE_UNLOCK_SOUND_MORSE = '-... --.'; // "BG"
export const CORRECT_ANSWER_SOUND_MORSE = '-.-.'; // "C" for Correct
export const INCORRECT_ANSWER_SOUND_MORSE = '..';   // "I" for Incorrect

const isCharMastered = (char: string, progressData: ProgressData): boolean => {
    const prog = progressData[char];
    if (!prog) return false;
    const correctRate = prog.attempts > 0 ? prog.correct / prog.attempts : 0;
    return prog.correct >= MASTERY_THRESHOLD_CORRECT && correctRate >= MASTERY_THRESHOLD_PERCENT;
};

const countMasteredInCategory = (category: 'letters' | 'numbers' | 'punctuation', progressData: ProgressData): number => {
    return MORSE_CODE_MAP.filter(item => item.category === category)
                         .reduce((count, item) => isCharMastered(item.char, progressData) ? count + 1 : count, 0);
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_steps', name: 'First Steps', description: 'Correctly answered your first quiz question.',
    icon: AwardIcon, // Assuming AwardIcon is a component
    condition: (progressData, userStats) => Object.values(progressData).some(p => p.correct > 0),
  },
  {
    id: 'letter_learner', name: 'Letter Learner', description: `Mastered ${Math.min(5, CHARACTER_SETS.find(cs => cs.id === 'letters')?.characters.length || 0)} letters.`,
    icon: AwardIcon,
    condition: (progressData) => countMasteredInCategory('letters', progressData) >= Math.min(5, CHARACTER_SETS.find(cs => cs.id === 'letters')?.characters.length || 0),
  },
  {
    id: 'letter_master', name: 'Letter Master', description: 'Mastered all letters.',
    icon: AwardIcon,
    condition: (progressData) => countMasteredInCategory('letters', progressData) === (CHARACTER_SETS.find(cs => cs.id === 'letters')?.characters.length || -1),
  },
   {
    id: 'number_novice', name: 'Number Novice', description: `Mastered ${Math.min(3, CHARACTER_SETS.find(cs => cs.id === 'numbers')?.characters.length || 0)} numbers.`,
    icon: AwardIcon,
    condition: (progressData) => countMasteredInCategory('numbers', progressData) >= Math.min(3, CHARACTER_SETS.find(cs => cs.id === 'numbers')?.characters.length || 0),
  },
  {
    id: 'number_ace', name: 'Number Ace', description: 'Mastered all numbers.',
    icon: AwardIcon,
    condition: (progressData) => countMasteredInCategory('numbers', progressData) === (CHARACTER_SETS.find(cs => cs.id === 'numbers')?.characters.length || -1),
  },
   {
    id: 'punctuation_pioneer', name: 'Punctuation Pioneer', description: `Mastered ${Math.min(3, CHARACTER_SETS.find(cs => cs.id === 'punctuation')?.characters.length || 0)} punctuation marks.`,
    icon: AwardIcon,
    condition: (progressData) => countMasteredInCategory('punctuation', progressData) >= Math.min(3, CHARACTER_SETS.find(cs => cs.id === 'punctuation')?.characters.length || 0),
  },
  {
    id: 'morse_initiate', name: 'Morse Initiate', description: 'Reached Level 2.',
    icon: StarIcon,
    condition: (_, userStats) => userStats.level >= 2,
  },
  {
    id: 'morse_adept', name: 'Morse Adept', description: 'Reached Level 5.',
    icon: StarIcon,
    condition: (_, userStats) => userStats.level >= 5,
  },
  {
    id: 'morse_virtuoso', name: 'Morse Virtuoso', description: 'Reached Level 10.',
    icon: StarIcon,
    condition: (_, userStats) => userStats.level >= 10,
  },
  {
    id: 'streak_starter_5', name: 'Streak Starter', description: 'Achieved a 5-correct-answer streak.',
    icon: FlameIcon,
    condition: (_, userStats) => userStats.longestQuizStreak >= 5,
  },
  {
    id: 'streak_master_10', name: 'Streak Master', description: 'Achieved a 10-correct-answer streak.',
    icon: FlameIcon,
    condition: (_, userStats) => userStats.longestQuizStreak >= 10,
  },
  {
    id: 'daily_dabbler', name: 'Daily Dabbler', description: 'Claimed the daily bonus for the first time.',
    icon: AwardIcon,
    condition: (_, userStats) => userStats.dailyBonusClaimsCount >= 1,
  },
  {
    id: 'consistent_coder', name: 'Consistent Coder', description: 'Claimed the daily bonus 5 times.',
    icon: AwardIcon,
    condition: (_, userStats) => userStats.dailyBonusClaimsCount >= 5,
  },
  {
    id: 'perfect_quiz_round', name: 'Perfect Round', description: `Completed a quiz session with no mistakes.`,
    icon: AwardIcon,
    condition: (progressData, userStats, quizSessionStats) => !!quizSessionStats && quizSessionStats.questionsAttempted === MAX_QUIZ_QUESTIONS && quizSessionStats.mistakesMade === 0,
  },
   {
    id: 'quiz_warrior', name: 'Quiz Warrior', description: `Completed ${MAX_QUIZ_QUESTIONS} quiz sessions.`,
    icon: AwardIcon,
    condition: (progressData, userStats) => userStats.completedQuizSessions >= 10,
  },
];

export const getXPForNextLevel = (level: number): number => {
  return XP_BASE_FOR_LEVEL_UP * level;
};