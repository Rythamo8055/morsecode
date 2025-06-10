import React, { useState, useEffect, useCallback } from 'react';
import { QuizMode, QuizQuestion, ProgressData, Settings } from '../types';
import { MORSE_CODE_MAP, ALL_CHARACTERS, QUIZ_OPTIONS_COUNT, MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MAX_QUIZ_QUESTIONS, PRO_MODE_PLAYBACK_SPEED } from '../constants';
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

  const unmasteredChars = availableChars.filter(char => {
    const prog = progressData[char];
    if (!prog) return true;
    const correctRate = prog.attempts > 0 ? prog.correct / prog.attempts : 0;
    return !(prog.correct >= MASTERY_THRESHOLD_CORRECT && correctRate >= MASTERY_THRESHOLD_PERCENT);
  });

  if (unmasteredChars.length > 0) {
    availableChars = unmasteredChars;
  }
  
  availableChars.sort((a, b) => (progressData[a]?.attempts || 0) - (progressData[b]?.attempts || 0));
  
  const targetChar = availableChars[Math.floor(Math.random() * Math.min(availableChars.length, 5))];
  if (!targetChar) return null;

  const morseItem = MORSE_CODE_MAP.find(item => item.char === targetChar);
  if (!morseItem) return null;

  const modes = Object.values(QuizMode);
  const randomMode = modes[Math.floor(Math.random() * modes.length)];

  let options: string[] | undefined;
  if (randomMode === QuizMode.LetterToMorse || randomMode === QuizMode.MorseToLetter) {
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

  const { isPlaying, playMorse } = useMorsePlayer(settings.isProMode ? PRO_MODE_PLAYBACK_SPEED : settings.playbackSpeed, settings.soundEnabled);


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
    if (question && question.mode === QuizMode.MorseToLetter && settings.soundEnabled) {
      playMorse(question.morse);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData, settings.soundEnabled, questionsAnswered, settings.isProMode, settings.playbackSpeed, playMorse, onShowSnackbar]);

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
    }, isCorrect && settings.soundEnabled ? 1500 : 1000); 
  };
  
  const handleTypeItOutInput = (input: '.' | '-') => {
    setTypedMorse(prev => prev + input);
    if(settings.soundEnabled) playMorse(input); // Play sound for individual dit/dah
  };

  if (quizComplete) {
    return (
        <div 
          className="p-6 text-center bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl border border-[var(--md-sys-color-outline-variant)] max-w-sm mx-auto mt-4"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
            <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-surface)] mb-4">Quiz Finished!</h2>
            <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6">You've completed the quiz session. Check your progress or start a new quiz.</p>
            <Button onClick={() => { setQuestionsAnswered(0); setQuizComplete(false); loadNextQuestion(); }}>Start New Quiz</Button>
        </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-4 text-center text-[var(--md-sys-color-on-surface-variant)]">Loading question...</div>;
  }

  const renderInput = () => {
    switch (currentQuestion.mode) {
      case QuizMode.LetterToMorse:
        return (
          <>
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] mb-2">Enter Morse for:</p>
            <p className="text-6xl font-bold text-[var(--md-sys-color-primary)] mb-6">{currentQuestion.character}</p>
            {currentQuestion.options ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {currentQuestion.options.map(opt => (
                        <Button key={opt} variant="tonal" onClick={() => handleSubmit(opt)} disabled={isSubmitting} className="!text-lg !font-mono !tracking-widest">
                            {opt}
                        </Button>
                    ))}
                </div>
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
            )}
          </>
        );
      case QuizMode.MorseToLetter:
        return (
          <>
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] mb-2">Enter character for:</p>
            <div className="flex items-center justify-center mb-6">
                <p className="text-4xl font-mono tracking-widest text-[var(--md-sys-color-primary)] mr-4">{currentQuestion.morse}</p>
                <IconButton onClick={() => playMorse(currentQuestion.morse)} disabled={isPlaying || isSubmitting} aria-label="Play Morse code">
                    <PlayArrowIcon />
                </IconButton>
            </div>
             {currentQuestion.options ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                    {currentQuestion.options.map(opt => (
                        <Button key={opt} variant="tonal" onClick={() => handleSubmit(opt)} disabled={isSubmitting} className="!text-2xl">
                            {opt}
                        </Button>
                    ))}
                </div>
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
            )}
          </>
        );
      case QuizMode.TypeItOut:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
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
            <Button onClick={() => handleSubmit()} disabled={isSubmitting} className="w-full mt-6">
                Submit
            </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;