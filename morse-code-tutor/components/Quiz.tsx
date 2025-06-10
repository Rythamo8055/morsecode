import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizMode, ProgressData } from '../types';
import { MORSE_CODE_MAP, ALPHABET, NUMBERS, PUNCTUATION, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT } from '../constants';
import useMorsePlayer from '../hooks/useMorsePlayer';

interface QuizProps {
  progressData: ProgressData;
  updateProgress: (char: string, correct: boolean) => void;
  isProMode: boolean;
  baseUnitDuration: number;
  isSoundGloballyEnabled: boolean;
  showSnackbar: (message: string, type: 'success' | 'error' | 'info') => void;
}

const QUIZ_PUNCTUATION = ['.', ',', '?']; // Limited set for quiz sanity
const ALL_QUIZ_CHARS = [...ALPHABET, ...NUMBERS, ...QUIZ_PUNCTUATION]; 

// M3 Icons
const PlayIcon = (props: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
);
const BackspaceIcon = (props: {className?: string}) => (
 <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor" {...props}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.12c.36.53.9.88 1.59.88h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.71 13.29L16.88 15l-2.17-2.17L12.54 15l-1.41-1.41L13.3 11.41l-2.17-2.17L12.54 7.7l2.17 2.17L16.88 7.7l1.41 1.41L16.12 11.3l2.17 2.17-1.4 1.82z"/></svg>
);


const Quiz: React.FC<QuizProps> = ({ 
  progressData, 
  updateProgress, 
  isProMode, 
  baseUnitDuration, 
  isSoundGloballyEnabled,
  showSnackbar
}) => {
  const [quizMode, setQuizMode] = useState<QuizMode>(QuizMode.LetterToMorse);
  const [currentQuestion, setCurrentQuestion] = useState<{ char: string; code: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]); 
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isQuestionAnswered, setIsQuestionAnswered] = useState<boolean>(false);
  
  const { playMorseCode, isPlaying, setBaseUnitDuration: setPlayerBaseUnitDuration } = useMorsePlayer(isSoundGloballyEnabled);

  useEffect(() => {
    setPlayerBaseUnitDuration(baseUnitDuration);
  }, [baseUnitDuration, setPlayerBaseUnitDuration]);

  const getNextQuestion = useCallback(() => {
    setIsQuestionAnswered(false);
    setUserAnswer('');

    const weightedChars = ALL_QUIZ_CHARS.map(char => {
      const stats = progressData[char] || { correctAttempts: 0, totalAttempts: 0, mastered: false };
      let weight = 10; 
      if (stats.mastered || (stats.correctAttempts >= MASTERY_THRESHOLD_CORRECT && stats.correctAttempts/Math.max(1, stats.totalAttempts) >= MASTERY_THRESHOLD_PERCENT)) {
        weight = 2; // Lower weight for mastered
      } else {
        weight += (5 - Math.min(5, stats.totalAttempts)); // Prioritize less attempted
        weight += ((stats.totalAttempts - stats.correctAttempts) * 3); // Prioritize incorrect
      }
      return { char, weight };
    }).filter(c => MORSE_CODE_MAP[c.char]); // Ensure character has a Morse code mapping
    
    const selectionPool: string[] = [];
    weightedChars.forEach(item => {
        for(let i = 0; i < Math.max(1, item.weight); i++) { // Ensure at least one entry if weight is low but not zero
            selectionPool.push(item.char);
        }
    });

    if (selectionPool.length === 0) {
        setCurrentQuestion(null); 
        showSnackbar("All quiz characters mastered or none available!", "info");
        return;
    }
    
    const randomChar = selectionPool[Math.floor(Math.random() * selectionPool.length)];
    const code = MORSE_CODE_MAP[randomChar];
    setCurrentQuestion({ char: randomChar, code });
    
    // MCQ option generation
    const isMCQMode = quizMode === QuizMode.MorseToLetter || (quizMode === QuizMode.LetterToMorse && Math.random() < 0.75); // 75% chance for MCQ in LetterToMorse

    if (isMCQMode) {
      const correctOption = quizMode === QuizMode.MorseToLetter ? randomChar : code;
      const wrongOptionsSet = new Set<string>();
      let potentialDistractors = ALL_QUIZ_CHARS.filter(c => c !== randomChar); // Exclude the correct answer character

      // Shuffle distractors
      for (let i = potentialDistractors.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [potentialDistractors[i], potentialDistractors[j]] = [potentialDistractors[j], potentialDistractors[i]];
      }

      for (const distractorChar of potentialDistractors) {
          if (wrongOptionsSet.size >= 3) break; // Need 3 wrong options for a total of 4
          const wrongOptionValue = quizMode === QuizMode.MorseToLetter 
                                      ? distractorChar 
                                      : MORSE_CODE_MAP[distractorChar];
          if (wrongOptionValue && wrongOptionValue !== correctOption) { // Ensure wrong option is valid and different
            wrongOptionsSet.add(wrongOptionValue);
          }
      }
      
      if (wrongOptionsSet.size >= 1) { // Only proceed if we have at least one valid distractor
        setOptions([correctOption, ...Array.from(wrongOptionsSet)].sort(() => Math.random() - 0.5));
      } else {
        // Fallback if not enough distractors can be generated for MCQ
        setOptions([]); 
      }
    } else {
      setOptions([]); // Not an MCQ mode or failed to generate options
    }
  }, [quizMode, progressData, showSnackbar]);

  useEffect(() => {
    getNextQuestion();
  }, [getNextQuestion]); // Rerun when quizMode changes

  const processAnswer = (answer: string) => {
    if (!currentQuestion || isQuestionAnswered) return;

    let correct = false;
    let correctAnswerDisplay = ""; // For feedback message

    if (quizMode === QuizMode.LetterToMorse) {
      correct = answer.trim().toLowerCase() === currentQuestion.code.toLowerCase();
      correctAnswerDisplay = currentQuestion.code;
    } else if (quizMode === QuizMode.MorseToLetter) {
      correct = answer.trim().toUpperCase() === currentQuestion.char.toUpperCase();
      correctAnswerDisplay = currentQuestion.char;
    } else if (quizMode === QuizMode.TypeItOut) {
      correct = answer.trim() === currentQuestion.code;
      correctAnswerDisplay = currentQuestion.code;
    }

    setIsQuestionAnswered(true);
    updateProgress(currentQuestion.char, correct);

    if (correct) {
      showSnackbar(`Correct! ${currentQuestion.char} is ${correctAnswerDisplay}`, 'success');
      if (isSoundGloballyEnabled) {
        // Play sound after a short delay to let snackbar appear
        setTimeout(() => playMorseCode(currentQuestion.code, isProMode), 300);
      }
    } else {
      const presentedQuestion = quizMode === QuizMode.MorseToLetter ? currentQuestion.code : currentQuestion.char;
      showSnackbar(`Incorrect. For "${presentedQuestion}", the answer is ${correctAnswerDisplay}.`, 'error');
    }

    setTimeout(() => {
      getNextQuestion();
    }, correct ? 1800 : 3000); // Shorter delay for correct, longer for incorrect to read feedback
  };
  
  const handleOptionClick = (option: string) => {
    processAnswer(option);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    processAnswer(userAnswer);
  };

  const quizModeOptions = useMemo(() => [
    { key: QuizMode.LetterToMorse, label: "Char to Morse" },
    { key: QuizMode.MorseToLetter, label: "Morse to Char" },
    { key: QuizMode.TypeItOut, label: "Type It Out" }
  ], []);

  const renderQuestion = () => {
    if (!currentQuestion) return <div className="text-[var(--md-sys-color-on-surface-variant-dark)] min-h-[120px] flex items-center justify-center text-lg p-4">Loading question...</div>;
    
    let questionText = "";
    if (quizMode === QuizMode.LetterToMorse) questionText = "What's the Morse code for:";
    else if (quizMode === QuizMode.MorseToLetter) questionText = "What character is this Morse code?";
    else if (quizMode === QuizMode.TypeItOut) questionText = "Type the Morse code for:";

    return (
      <div className="text-center my-6 min-h-[120px]">
        {/* M3 Body Medium */}
        <p className="text-sm leading-5 text-[var(--md-sys-color-on-surface-variant-dark)] mb-2">{questionText}</p>
        {/* M3 Display Small or Headline Large for emphasis */}
        <p className={`text-4xl sm:text-5xl font-medium my-3 break-all 
                      ${quizMode === QuizMode.MorseToLetter 
                        ? 'text-[var(--md-sys-color-tertiary-dark)] font-mono tracking-wider py-2' 
                        : 'text-[var(--md-sys-color-primary-dark)] py-2'}`}>
          {quizMode === QuizMode.MorseToLetter ? currentQuestion.code : currentQuestion.char}
        </p>
        {quizMode === QuizMode.MorseToLetter && (
          // M3 Icon Button
          <button 
            onClick={() => playMorseCode(currentQuestion.code, isProMode)} 
            disabled={isPlaying || !isSoundGloballyEnabled}
            className="m3-ripple mt-1 p-2.5 rounded-[var(--md-sys-shape-corner-full)] text-[var(--md-sys-color-secondary-dark)] 
                       hover:bg-[var(--md-sys-color-secondary-dark)] hover:bg-opacity-[var(--md-sys-state-hover-state-layer-opacity)]
                       focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-secondary-dark)] focus-visible:ring-offset-1
                       disabled:opacity-50 disabled:text-[var(--md-sys-color-on-surface-variant-dark)] disabled:hover:bg-transparent"
            aria-label="Play Morse code sound"
          >
            <PlayIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    );
  };

  const renderAnswerInput = () => {
    if (!currentQuestion || isQuestionAnswered) return <div className="min-h-[160px] sm:min-h-[200px]"></div>; // Placeholder for height consistency

    // MCQ for LetterToMorse (if options available) or MorseToLetter (if options available)
    if (options.length > 1 && (quizMode === QuizMode.LetterToMorse || quizMode === QuizMode.MorseToLetter)) {
      return (
        // M3 Filled Tonal Buttons or Outlined Buttons for options
        <div className="grid grid-cols-2 gap-3 my-4">
          {options.map(option => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="m3-ripple py-3 px-3 text-base sm:text-lg font-medium rounded-[var(--md-sys-shape-corner-full)] transition-colors shadow-sm
                         bg-[var(--md-sys-color-secondary-container-dark)] text-[var(--md-sys-color-on-secondary-container-dark)]
                         hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container-dark)_90%,var(--md-sys-color-on-secondary-container-dark)_10%)] /* Hover state layer */
                         focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface-container-dark)]"
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    if (quizMode === QuizMode.TypeItOut) {
      return (
        <div className="my-5">
          {/* M3 Text Field like display for typed answer */}
          <div className="text-center text-3xl font-mono p-3 min-h-[60px] align-middle flex items-center justify-center
                        bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-dark)] 
                        rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant-dark)] mb-5 tracking-widest break-all">
            {userAnswer || <span className="text-[var(--md-sys-color-on-surface-variant-dark)] opacity-70 text-xl">Tap below</span>}
          </div>
          {/* M3 Filled Tonal Buttons for Dit / Dah */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => setUserAnswer(prev => prev + '.')} className="m3-ripple py-5 px-4 rounded-[var(--md-sys-shape-corner-lg)] text-4xl font-bold shadow-md
                               bg-[var(--md-sys-color-secondary-container-dark)] text-[var(--md-sys-color-on-secondary-container-dark)] 
                               hover:bg-opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-secondary-dark)]">.</button>
            <button onClick={() => setUserAnswer(prev => prev + '-')} className="m3-ripple py-5 px-4 rounded-[var(--md-sys-shape-corner-lg)] text-4xl font-bold shadow-md
                               bg-[var(--md-sys-color-tertiary-container-dark)] text-[var(--md-sys-color-on-tertiary-container-dark)] 
                               hover:bg-opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-tertiary-dark)]">-</button>
          </div>
          {/* M3 Text Buttons or Outlined Buttons for Clear/Backspace */}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setUserAnswer(prev => prev.slice(0, -1))} className="m3-ripple flex-1 px-3 py-2.5 rounded-[var(--md-sys-shape-corner-full)] text-sm shadow 
                               bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-variant-dark)] hover:bg-opacity-80
                               flex items-center justify-center focus-visible:ring-1 focus-visible:ring-[var(--md-sys-color-outline-dark)]">
                <BackspaceIcon className="mr-1.5"/> Backspace
            </button>
            <button onClick={() => setUserAnswer('')} className="m3-ripple flex-1 px-3 py-2.5 rounded-[var(--md-sys-shape-corner-full)] text-sm shadow
                               bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-variant-dark)] hover:bg-opacity-80
                               focus-visible:ring-1 focus-visible:ring-[var(--md-sys-color-outline-dark)]">Clear</button>
          </div>
          {/* M3 Filled Button for Submit */}
          <button onClick={() => handleSubmit()} className="m3-ripple w-full mt-6 px-6 py-3 rounded-[var(--md-sys-shape-corner-full)] text-base font-medium shadow-md transition-colors
                               bg-[var(--md-sys-color-primary-dark)] text-[var(--md-sys-color-on-primary-dark)] 
                               hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary-dark)_90%,var(--md-sys-color-on-primary-dark)_10%)]
                               focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface-container-dark)] focus-visible:ring-[var(--md-sys-color-primary-dark)]">Submit</button>
        </div>
      );
    }

    // Default: M3 Filled Text Field
    return ( 
      <form onSubmit={handleSubmit} className="my-5 space-y-5">
        <div> {/* Input container for M3 Filled Text Field like styling */}
            <label htmlFor="quizAnswerInput" className="sr-only">
                {quizMode === QuizMode.LetterToMorse ? "Enter Morse code (e.g. .-)" : "Enter letter or symbol"}
            </label>
            <input
              type="text"
              id="quizAnswerInput"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full h-[56px] px-4 pt-5 pb-2 bg-[var(--md-sys-color-surface-container-high-dark)] text-[var(--md-sys-color-on-surface-dark)] 
                         border-b-2 border-[var(--md-sys-color-on-surface-variant-dark)] rounded-t-[var(--md-sys-shape-corner-xs)] text-base leading-6 
                         focus:border-[var(--md-sys-color-primary-dark)] focus:border-b-[3px] 
                         placeholder-transparent peer shadow-sm transition-colors"
              placeholder={quizMode === QuizMode.LetterToMorse ? "e.g. .-" : "e.g. A"}
              autoFocus
              disabled={isQuestionAnswered}
            />
             {/* Floating label emulation for M3 Filled Text Field */}
            <span className={`absolute left-4 top-2 text-xs text-[var(--md-sys-color-on-surface-variant-dark)] transition-all pointer-events-none 
                            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[var(--md-sys-color-primary-dark)]
                            ${userAnswer ? 'top-2 text-xs' : 'top-4 text-base'}`}>
               {quizMode === QuizMode.LetterToMorse ? "Morse code" : "Character"}
            </span>
        </div>
        {/* M3 Filled Button for Submit */}
        <button type="submit" disabled={isQuestionAnswered} className="m3-ripple w-full px-6 py-3 rounded-[var(--md-sys-shape-corner-full)] text-base font-medium shadow-md transition-colors
                           bg-[var(--md-sys-color-primary-dark)] text-[var(--md-sys-color-on-primary-dark)]
                           hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary-dark)_90%,var(--md-sys-color-on-primary-dark)_10%)]
                           disabled:bg-[var(--md-sys-color-on-surface-dark)] disabled:bg-opacity-[0.12] disabled:text-[var(--md-sys-color-on-surface-dark)] disabled:text-opacity-[0.38] disabled:cursor-not-allowed
                           focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--md-sys-color-surface-container-dark)] focus-visible:ring-[var(--md-sys-color-primary-dark)]">Submit Answer</button>
      </form>
    );
  };

  return (
    // M3 Card for Quiz
    <div className="p-4 sm:p-5 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl my-4 mx-auto max-w-md">
      {/* M3 Segmented Buttons */}
      <div className="flex justify-center items-stretch border border-[var(--md-sys-color-outline-dark)] rounded-[var(--md-sys-shape-corner-full)] mb-6 overflow-hidden shadow-sm h-10">
        {quizModeOptions.map((opt, index) => (
          <button
            key={opt.key}
            onClick={() => {
              if (quizMode !== opt.key) setQuizMode(opt.key);
            }}
            className={`m3-ripple flex-1 px-3 py-2 text-sm font-medium transition-all duration-150 ease-in-out relative
                        focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary-dark)] focus-visible:ring-inset
              ${quizMode === opt.key 
                ? 'bg-[var(--md-sys-color-secondary-container-dark)] text-[var(--md-sys-color-on-secondary-container-dark)]' 
                : 'text-[var(--md-sys-color-on-surface-variant-dark)] hover:bg-[var(--md-sys-color-surface-container-high-dark)]'}
              ${index > 0 ? 'border-l border-[var(--md-sys-color-outline-dark)]' : ''}
            `}
            aria-pressed={quizMode === opt.key}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {renderQuestion()}
      {renderAnswerInput()}
    </div>
  );
};

export default Quiz;