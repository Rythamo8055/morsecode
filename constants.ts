
import { MorseCodeMap, CharacterSet, CharacterProgress, Settings } from './types';

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
  acc[char] = { attempts: 0, correct: 0 };
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
