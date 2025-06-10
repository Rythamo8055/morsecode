
import React, { useState, useEffect, useCallback } from 'react';
import { QuizMode, QuizQuestion, ProgressData, Settings } from '../types';
import { MORSE_CODE_MAP, ALL_CHARACTERS, QUIZ_OPTIONS_COUNT, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MAX_QUIZ_QUESTIONS } from '../constants';
import Button from './Button';
import TextField from './TextField';
import useMorsePlayer from '../hooks/useMorsePlayer';
import IconButton from './IconButton';
import PlayArrowIcon from './icons/PlayArrowIcon';
import DotIcon from './icons/DotIcon';
import DashIcon from './icons/DashIcon';

interface QuizProps {
  progressData: ProgressData;
  onUpdateProgress: (char: string, isCorrect: boolean) => void;
  settings: Settings;
  onShowSnackbar: (message: string, type: 'success' | 'error' | 'info') => void;
}

const generateQuestion = (progressData: ProgressData): QuizQuestion | null => {
  let availableChars = [...ALL_CHARACTERS];

  // Prioritize unmastered characters
  const unmasteredChars = availableChars.filter(char => {
    const prog = progressData[char];
    if (!prog) return true;
    const correctRate = prog.attempts > 0 ? prog.correct / prog.attempts : 0;
    return !(prog.correct >= MASTERY_THRESHOLD_CORRECT && correctRate >= MASTERY_THRESHOLD_PERCENT);
  });

  if (unmasteredChars.length > 0) {
    availableChars = unmasteredChars;
  }
  
  // Further prioritize by fewest attempts among the selected pool
  availableChars.sort((a, b) => (progressData[a]?.attempts || 0) - (progressData[b]?.attempts || 0));
  
  const targetChar = availableChars[Math.floor(Math.random() * Math.min(availableChars.length, 5))]; // Pick from top 5 least attempted
  if (!targetChar) return null;

  const morseItem = MORSE_CODE_MAP.find(item => item.char === targetChar);
  if (!morseItem) return null;

  const modes = Object.values(QuizMode);
  const randomMode = modes[Math.floor(Math.random() * modes.length)];

  let options: string[] | undefined;
  if (randomMode === QuizMode.LetterToMorse || randomMode === QuizMode.MorseToLetter) {
    options = [morseItem.morse]; // Start with the correct answer
    if (randomMode === QuizMode.LetterToMorse) { // Options are Morse codes
        while (options.length < QUIZ_OPTIONS_COUNT) {
            const randomMorseItem = MORSE_CODE_MAP[Math.floor(Math.random() * MORSE_CODE_MAP.length)];
            if (!options.includes(randomMorseItem.morse)) {
                options.push(randomMorseItem.morse);
            }
        }
    } else { // Options are characters
        options = [morseItem.char];
         while (options.length < QUIZ_OPTIONS_COUNT) {
            const randomCharItem = MORSE_CODE_MAP[Math.floor(Math.random() * MORSE_CODE_MAP.length)];
            if (!options.includes(randomCharItem.char)) {
                options.push(randomCharItem.char);
            }
        }
    }
    options.sort(() => Math.random() - 0.5); // Shuffle options
  }


  return {
    id: morseItem.char,
    character: morseItem.char,
    morse: morseItem.morse,
    mnemonic: morseItem.mnemonic,
    mode: randomMode,
    options,
  };
};


const Quiz: React.FC<QuizProps> = ({ progressData, onUpdateProgress, settings, onShowSnackbar }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [typedMorse, setTypedMorse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const { isPlaying, playMorse } = useMorsePlayer(settings.isProMode ? settings.playbackSpeed / 2 : settings.playbackSpeed, settings.soundEnabled);

  const loadNextQuestion = useCallback(() => {
    if(questionsAnswered >= MAX_QUIZ_QUESTIONS) {
        setQuizComplete(true);
        setCurrentQuestion(null);
        onShowSnackbar(`Quiz complete! You answered ${MAX_QUIZ_QUESTIONS} questions.`, 'info');
        return;
    }
    const question = generateQuestion(progressData);
    setCurrentQuestion(question);
    setUserAnswer('');
    setTypedMorse('');
    setIsSubmitting(false);
    if (question && question.mode === QuizMode.MorseToLetter) {
      playMorse(question.morse);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData, playMorse, questionsAnswered]); // playMorse has soundEnabled as dep

  useEffect(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);
  
  const handleSubmit = (answer?: string) => {
    if (!currentQuestion || isSubmitting) return;
    setIsSubmitting(true);

    const finalAnswer = answer !== undefined ? answer : (currentQuestion.mode === QuizMode.TypeItOut ? typedMorse : userAnswer);
    let isCorrect = false;

    switch (currentQuestion.mode) {
      case QuizMode.LetterToMorse:
        isCorrect = finalAnswer.trim() === currentQuestion.morse;
        break;
      case QuizMode.MorseToLetter:
        isCorrect = finalAnswer.trim().toUpperCase() === currentQuestion.character.toUpperCase();
        break;
      case QuizMode.TypeItOut:
        isCorrect = finalAnswer.trim() === currentQuestion.morse;
        break;
    }

    onUpdateProgress(currentQuestion.character, isCorrect);
    onShowSnackbar(isCorrect ? 'Correct!' : `Incorrect. The answer was ${currentQuestion.mode === QuizMode.MorseToLetter ? currentQuestion.character : currentQuestion.morse}`, isCorrect ? 'success' : 'error');
    
    if (isCorrect && settings.soundEnabled) {
      playMorse(currentQuestion.morse);
    }
    
    setQuestionsAnswered(prev => prev + 1);

    setTimeout(() => {
      loadNextQuestion();
    }, isCorrect && settings.soundEnabled ? 1500 : 1000); // Delay for feedback / sound
  };
  
  const handleTypeItOutInput = (input: '.' | '-') => {
    setTypedMorse(prev => prev + input);
  };

  if (quizComplete) {
    return (
        <div className="p-4 text-center">
            <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-4">Quiz Finished!</h2>
            <p className="text-[var(--md-sys-color-on-surface-variant-dark)] mb-6">You've completed the quiz session. Check your progress or start a new quiz.</p>
            <Button onClick={() => { setQuestionsAnswered(0); setQuizComplete(false); loadNextQuestion(); }}>Start New Quiz</Button>
        </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-4 text-center text-[var(--md-sys-color-on-surface-variant-dark)]">Loading question...</div>;
  }

  const renderInput = () => {
    switch (currentQuestion.mode) {
      case QuizMode.LetterToMorse:
        return (
          <>
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant-dark)] mb-2">Enter Morse for:</p>
            <p className="text-6xl font-bold text-[var(--md-sys-color-primary-dark)] mb-6">{currentQuestion.character}</p>
            <TextField
              id="letterToMorseInput"
              label="Type Morse code (e.g., .-)"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {currentQuestion.options && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {currentQuestion.options.map(opt => (
                        <Button key={opt} variant="tonal" onClick={() => handleSubmit(opt)} disabled={isSubmitting}>
                            {opt}
                        </Button>
                    ))}
                </div>
            )}
          </>
        );
      case QuizMode.MorseToLetter:
        return (
          <>
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant-dark)] mb-2">Enter character for:</p>
            <div className="flex items-center justify-center mb-6">
                <p className="text-4xl font-mono tracking-widest text-[var(--md-sys-color-primary-dark)] mr-4">{currentQuestion.morse}</p>
                <IconButton onClick={() => playMorse(currentQuestion.morse)} disabled={isPlaying || isSubmitting} aria-label="Play Morse code">
                    <PlayArrowIcon />
                </IconButton>
            </div>
            <TextField
              id="morseToLetterInput"
              label="Type character"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
              disabled={isSubmitting}
              autoFocus
              maxLength={1}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
             {currentQuestion.options && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {currentQuestion.options.map(opt => (
                        <Button key={opt} variant="tonal" onClick={() => handleSubmit(opt)} disabled={isSubmitting}>
                            {opt}
                        </Button>
                    ))}
                </div>
            )}
          </>
        );
      case QuizMode.TypeItOut:
        return (
          <>
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant-dark)] mb-2">Tap out Morse for:</p>
            <p className="text-6xl font-bold text-[var(--md-sys-color-primary-dark)] mb-6">{currentQuestion.character}</p>
            <div className="h-10 px-3 py-2 mb-4 text-2xl font-mono tracking-widest text-center border rounded-[var(--md-sys-shape-corner-sm)] border-[var(--md-sys-color-outline-dark)] text-[var(--md-sys-color-on-surface-dark)] bg-[var(--md-sys-color-surface-container-low-dark)] min-h-[2.5rem]">
              {typedMorse || <span className="opacity-50">Your input</span>}
            </div>
            <div className="flex justify-center space-x-4 mb-4">
              <Button onClick={() => handleTypeItOutInput('.')} leadingIcon={<DotIcon />} disabled={isSubmitting} className="!px-10">Dit</Button>
              <Button onClick={() => handleTypeItOutInput('-')} leadingIcon={<DashIcon />} disabled={isSubmitting} className="!px-10">Dah</Button>
            </div>
            <Button onClick={() => setTypedMorse('')} variant="outlined" disabled={isSubmitting || typedMorse.length === 0} className="w-full mb-2">Clear</Button>
          </>
        );
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-2">Quiz Time!</h2>
      <p className="text-sm text-[var(--md-sys-color-on-surface-variant-dark)] mb-6">Question {questionsAnswered + 1} of {MAX_QUIZ_QUESTIONS}</p>
      
      <div className="w-full max-w-sm p-6 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-lg">
        {renderInput()}
        {currentQuestion.mode !== QuizMode.LetterToMorse && currentQuestion.mode !== QuizMode.MorseToLetter && ( /* Options are buttons */
            <Button onClick={() => handleSubmit()} disabled={isSubmitting} className="w-full mt-6">
                Submit
            </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
