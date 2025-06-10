
// MorseTreeNode and NarrationStep types were removed from types.ts

export const MORSE_CODE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.-',
};

export const ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
export const NUMBERS: string[] = "0123456789".split('');
export const PUNCTUATION: string[] = ['.', ',', '?', "'", '!', '/', '(', ')', '&', ':', ';', '=', '+', '-', '_', '"', '$', '@'];

export const INITIAL_DOT_DURATION_MS = 150; // Base unit for timing
export const MASTERY_THRESHOLD_CORRECT = 5; // Number of correct attempts to consider mastered
export const MASTERY_THRESHOLD_PERCENT = 0.8; // Or 80% correct if total attempts > some value (e.g. 10)

// MORSE_TREE_ROOT, NARRATION_STEPS, and getCharPath were removed.

export interface RhythmItem {
  char: string;
  code: string;
  mnemonic: string;
}

export const RHYTHM_MNEMONICS_LIST: RhythmItem[] = [
  { char: 'A', code: '.-', mnemonic: 'A-gainst' },
  { char: 'B', code: '-...', mnemonic: 'Bob is the man' },
  { char: 'C', code: '-.-.', mnemonic: 'Co-ca Co-la' },
  { char: 'D', code: '-..', mnemonic: 'Dog did it' },
  { char: 'E', code: '.', mnemonic: 'Eh?' },
  { char: 'F', code: '..-.', mnemonic: 'Did I do that?' },
  { char: 'G', code: '--.', mnemonic: 'Good God-frey' },
  { char: 'H', code: '....', mnemonic: 'Hip pi pi pi' },
  { char: 'I', code: '..', mnemonic: 'I see' },
  { char: 'J', code: '.---', mnemonic: 'In Jaws, Jaws, Jaws' },
  { char: 'K', code: '-.-', mnemonic: 'Kan-ga-roo' },
  { char: 'L', code: '.-..', mnemonic: 'To kill a cat' },
  { char: 'M', code: '--', mnemonic: 'Mm Mm' },
  { char: 'N', code: '-.', mnemonic: 'No-tice' },
  { char: 'O', code: '---', mnemonic: 'Oh my God' },
  { char: 'P', code: '.--.', mnemonic: 'A poo poo pants' },
  { char: 'Q', code: '--.-', mnemonic: 'God save the Queen' },
  { char: 'R', code: '.-.', mnemonic: 'Ro-ta-ry' },
  { char: 'S', code: '...', mnemonic: 'Si si si' },
  { char: 'T', code: '-', mnemonic: 'Tea' },
  { char: 'U', code: '..-', mnemonic: 'Un-i-form' },
  { char: 'V', code: '...-', mnemonic: 'Vic-to-ry Vee' },
  { char: 'W', code: '.--', mnemonic: 'The World War' },
  { char: 'X', code: '-..-', mnemonic: 'X marks the spot' },
  { char: 'Y', code: '-.--', mnemonic: 'Why oh why oh' },
  { char: 'Z', code: '--..', mnemonic: 'Zeus is a Zany' },
  { char: '1', code: '.----', mnemonic: 'I won one now' },
  { char: '2', code: '..---', mnemonic: 'Did I win too now?' },
  { char: '3', code: '...--', mnemonic: 'She is in a tree' },
  { char: '4', code: '....-', mnemonic: 'Can I have some more?' },
  { char: '5', code: '.....', mnemonic: 'Yes I have all five' },
  { char: '6', code: '-....', mnemonic: 'Shave off all my hair' },
  { char: '7', code: '--...', mnemonic: 'Oh oh what did she say?' },
  { char: '8', code: '---..', mnemonic: 'Oh my my I am late' },
  { char: '9', code: '----.', mnemonic: 'Now now now now then' },
  { char: '0', code: '-----', mnemonic: 'A long long long long long' },
];

export const RHYTHM_MNEMONICS_MAP: Record<string, RhythmItem> = 
  RHYTHM_MNEMONICS_LIST.reduce((acc, item) => {
    acc[item.char] = item;
    return acc;
  }, {} as Record<string, RhythmItem>);
