<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import { QuizMode, QuizQuestion, ProgressData, Settings } from '../types';
import { MORSE_CODE_MAP, ALL_CHARACTERS, QUIZ_OPTIONS_COUNT, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MAX_QUIZ_QUESTIONS, PRO_MODE_PLAYBACK_SPEED } from '../constants';
=======

import React, { useState, useEffect, useCallback } from 'react';
import { QuizMode, QuizQuestion, ProgressData, Settings } from '../types';
import { MORSE_CODE_MAP, ALL_CHARACTERS, QUIZ_OPTIONS_COUNT, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MAX_QUIZ_QUESTIONS } from '../constants';
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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

<<<<<<< HEAD
=======
  // Prioritize unmastered characters
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  const unmasteredChars = availableChars.filter(char => {
    const prog = progressData[char];
    if (!prog) return true;
    const correctRate = prog.attempts > 0 ? prog.correct / prog.attempts : 0;
    return !(prog.correct >= MASTERY_THRESHOLD_CORRECT && correctRate >= MASTERY_THRESHOLD_PERCENT);
  });

  if (unmasteredChars.length > 0) {
    availableChars = unmasteredChars;
  }
  
<<<<<<< HEAD
  availableChars.sort((a, b) => (progressData[a]?.attempts || 0) - (progressData[b]?.attempts || 0));
  
  const targetChar = availableChars[Math.floor(Math.random() * Math.min(availableChars.length, 5))];
=======
  // Further prioritize by fewest attempts among the selected pool
  availableChars.sort((a, b) => (progressData[a]?.attempts || 0) - (progressData[b]?.attempts || 0));
  
  const targetChar = availableChars[Math.floor(Math.random() * Math.min(availableChars.length, 5))]; // Pick from top 5 least attempted
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  if (!targetChar) return null;

  const morseItem = MORSE_CODE_MAP.find(item => item.char === targetChar);
  if (!morseItem) return null;

  const modes = Object.values(QuizMode);
  const randomMode = modes[Math.floor(Math.random() * modes.length)];

  let options: string[] | undefined;
  if (randomMode === QuizMode.LetterToMorse || randomMode === QuizMode.MorseToLetter) {
<<<<<<< HEAD
    options = [randomMode === QuizMode.LetterToMorse ? morseItem.morse : morseItem.char]; 
    const sourceArray = randomMode === QuizMode.LetterToMorse ? MORSE_CODE_MAP.map(item => item.morse) : MORSE_CODE_MAP.map(item => item.char);
    
    while (options.length < QUIZ_OPTIONS_COUNT) {
        const randomOption = sourceArray[Math.floor(Math.random() * sourceArray.length)];
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    options.sort(() => Math.random() - 0.5); 
  }

=======
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


>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
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

<<<<<<< HEAD
  const { isPlaying, playMorse } = useMorsePlayer(settings.isProMode ? PRO_MODE_PLAYBACK_SPEED : settings.playbackSpeed, settings.soundEnabled);

=======
  const { isPlaying, playMorse } = useMorsePlayer(settings.isProMode ? settings.playbackSpeed / 2 : settings.playbackSpeed, settings.soundEnabled);
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde

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
<<<<<<< HEAD
    if (question && question.mode === QuizMode.MorseToLetter && settings.soundEnabled) {
      playMorse(question.morse);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData, settings.soundEnabled, questionsAnswered, settings.isProMode, settings.playbackSpeed, playMorse, onShowSnackbar]);
=======
    if (question && question.mode === QuizMode.MorseToLetter) {
      playMorse(question.morse);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData, playMorse, questionsAnswered]); // playMorse has soundEnabled as dep
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde

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
<<<<<<< HEAD
    }, isCorrect && settings.soundEnabled ? 1500 : 1000); 
=======
    }, isCorrect && settings.soundEnabled ? 1500 : 1000); // Delay for feedback / sound
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  };
  
  const handleTypeItOutInput = (input: '.' | '-') => {
    setTypedMorse(prev => prev + input);
<<<<<<< HEAD
    if(settings.soundEnabled) playMorse(input); // Play sound for individual dit/dah
=======
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  };

  if (quizComplete) {
    return (
<<<<<<< HEAD
        <div 
          className="p-6 text-center bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl border border-[var(--md-sys-color-outline-variant)] max-w-sm mx-auto mt-4"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
            <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-surface)] mb-4">Quiz Finished!</h2>
            <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6">You've completed the quiz session. Check your progress or start a new quiz.</p>
=======
        <div className="p-4 text-center">
            <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-4">Quiz Finished!</h2>
            <p className="text-[var(--md-sys-color-on-surface-variant-dark)] mb-6">You've completed the quiz session. Check your progress or start a new quiz.</p>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            <Button onClick={() => { setQuestionsAnswered(0); setQuizComplete(false); loadNextQuestion(); }}>Start New Quiz</Button>
        </div>
    );
  }

  if (!currentQuestion) {
<<<<<<< HEAD
    return <div className="p-4 text-center text-[var(--md-sys-color-on-surface-variant)]">Loading question...</div>;
=======
    return <div className="p-4 text-center text-[var(--md-sys-color-on-surface-variant-dark)]">Loading question...</div>;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  }

  const renderInput = () => {
    switch (currentQuestion.mode) {
      case QuizMode.LetterToMorse:
        return (
          <>
<<<<<<< HEAD
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] mb-2">Enter Morse for:</p>
            <p className="text-6xl font-bold text-[var(--md-sys-color-primary)] mb-6">{currentQuestion.character}</p>
            {currentQuestion.options ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {currentQuestion.options.map(opt => (
                        <Button key={opt} variant="tonal" onClick={() => handleSubmit(opt)} disabled={isSubmitting} className="!text-lg !font-mono !tracking-widest">
=======
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
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
                            {opt}
                        </Button>
                    ))}
                </div>
<<<<<<< HEAD
            ) : (
                 <TextField
                    id="letterToMorseInput"
                    label="Type Morse code (e.g., .-)"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isSubmitting}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                 />
=======
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            )}
          </>
        );
      case QuizMode.MorseToLetter:
        return (
          <>
<<<<<<< HEAD
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] mb-2">Enter character for:</p>
            <div className="flex items-center justify-center mb-6">
                <p className="text-4xl font-mono tracking-widest text-[var(--md-sys-color-primary)] mr-4">{currentQuestion.morse}</p>
=======
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant-dark)] mb-2">Enter character for:</p>
            <div className="flex items-center justify-center mb-6">
                <p className="text-4xl font-mono tracking-widest text-[var(--md-sys-color-primary-dark)] mr-4">{currentQuestion.morse}</p>
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
                <IconButton onClick={() => playMorse(currentQuestion.morse)} disabled={isPlaying || isSubmitting} aria-label="Play Morse code">
                    <PlayArrowIcon />
                </IconButton>
            </div>
<<<<<<< HEAD
             {currentQuestion.options ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {currentQuestion.options.map(opt => (
                        <Button key={opt} variant="tonal" onClick={() => handleSubmit(opt)} disabled={isSubmitting} className="!text-2xl">
=======
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
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
                            {opt}
                        </Button>
                    ))}
                </div>
<<<<<<< HEAD
            ) : (
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
=======
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            )}
          </>
        );
      case QuizMode.TypeItOut:
        return (
          <>
<<<<<<< HEAD
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] mb-2">Tap out Morse for:</p>
            <p className="text-6xl font-bold text-[var(--md-sys-color-primary)] mb-6">{currentQuestion.character}</p>
            <div 
              className="h-12 px-3 py-2 mb-4 text-2xl font-mono tracking-widest text-center border rounded-[var(--md-sys-shape-corner-sm)] border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] bg-[var(--md-sys-color-surface-container-low)] min-h-[3rem] flex items-center justify-center"
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            >
              {typedMorse || <span className="opacity-50">Your input</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button onClick={() => handleTypeItOutInput('.')} leadingIcon={<DotIcon />} disabled={isSubmitting} variant="tonal" className="!h-14">Dit</Button>
              <Button onClick={() => handleTypeItOutInput('-')} leadingIcon={<DashIcon />} disabled={isSubmitting} variant="tonal" className="!h-14">Dah</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => setTypedMorse('')} variant="outlined" disabled={isSubmitting || typedMorse.length === 0}>Clear</Button>
                <Button onClick={() => handleSubmit()} disabled={isSubmitting || typedMorse.length === 0}>Submit</Button>
            </div>
=======
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
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
          </>
        );
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
<<<<<<< HEAD
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-2">Quiz Time!</h2>
      <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-6">Question {questionsAnswered + 1} of {MAX_QUIZ_QUESTIONS}</p>
      
      <div 
        className="w-full max-w-sm p-6 bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl border border-[var(--md-sys-color-outline-variant)]"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)' // For Safari
        }}
      >
        {renderInput()}
        {/* Submit button for text field entry modes, if options aren't used */}
        {((currentQuestion.mode === QuizMode.LetterToMorse && !currentQuestion.options) || (currentQuestion.mode === QuizMode.MorseToLetter && !currentQuestion.options)) && (
=======
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background-dark)] mb-2">Quiz Time!</h2>
      <p className="text-sm text-[var(--md-sys-color-on-surface-variant-dark)] mb-6">Question {questionsAnswered + 1} of {MAX_QUIZ_QUESTIONS}</p>
      
      <div className="w-full max-w-sm p-6 bg-[var(--md-sys-color-surface-container-dark)] rounded-[var(--md-sys-shape-corner-lg)] shadow-lg">
        {renderInput()}
        {currentQuestion.mode !== QuizMode.LetterToMorse && currentQuestion.mode !== QuizMode.MorseToLetter && ( /* Options are buttons */
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            <Button onClick={() => handleSubmit()} disabled={isSubmitting} className="w-full mt-6">
                Submit
            </Button>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Quiz;
=======
export default Quiz;
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
