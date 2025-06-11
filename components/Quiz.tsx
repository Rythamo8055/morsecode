
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizMode, QuizQuestion, ProgressData, Settings, UserStats, QuizSessionStats } from '../types';
import { 
    MORSE_CODE_MAP, ALL_CHARACTERS, QUIZ_OPTIONS_COUNT, 
    MASTERY_THRESHOLD_CORRECT, MASTERY_THRESHOLD_PERCENT, MAX_QUIZ_QUESTIONS, 
    PRO_MODE_PLAYBACK_SPEED, MAX_QUIZ_LIVES, 
    CORRECT_ANSWER_SOUND_MORSE, INCORRECT_ANSWER_SOUND_MORSE
} from '../constants';
import Button from './Button';
import TextField from './TextField';
import useMorsePlayer from '../hooks/useMorsePlayer';
import IconButton from './IconButton';
import PlayArrowIcon from './icons/PlayArrowIcon';
import DotIcon from './icons/DotIcon';
import DashIcon from './icons/DashIcon';
import HeartIcon from './icons/HeartIcon';
import StarIcon from './icons/StarIcon';
import FlameIcon from './icons/FlameIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CancelIcon from './icons/CancelIcon';

interface QuizProps {
  progressData: ProgressData;
  settings: Settings;
  userStats: UserStats;
  onQuestionAnswered: (char: string, isCorrect: boolean, currentSessionStreak: number, quizSessionStats: QuizSessionStats) => void;
  onSessionComplete: (quizSessionStats: QuizSessionStats) => void;
  onShowSnackbar: (message: string, type: 'success' | 'error' | 'info') => void;
  playUiSound: (morseCode: string) => void; // For correct/incorrect sounds
}

interface QuizFeedback {
  type: 'correct' | 'incorrect';
  message: string;
  char?: string;
  morse?: string;
}

const generateQuestion = (currentProgressData: ProgressData): QuizQuestion | null => {
  let availableChars = [...ALL_CHARACTERS];

  const unmasteredChars = availableChars.filter(char => {
    const prog = currentProgressData[char];
    if (!prog) return true; 
    const correctRate = prog.attempts > 0 ? prog.correct / prog.attempts : 0;
    return !(prog.correct >= MASTERY_THRESHOLD_CORRECT && correctRate >= MASTERY_THRESHOLD_PERCENT);
  });

  if (unmasteredChars.length > 0) {
    availableChars = unmasteredChars.sort((a,b) => (currentProgressData[a]?.attempts || 0) - (currentProgressData[b]?.attempts || 0));
  } else {
     availableChars.sort((a, b) => (currentProgressData[a]?.attempts || 0) - (currentProgressData[b]?.attempts || 0));
  }
  
  const selectionPoolSize = Math.max(1, Math.min(availableChars.length, Math.ceil(availableChars.length * 0.3))); // Slightly larger pool
  const targetChar = availableChars[Math.floor(Math.random() * selectionPoolSize)];

  if (!targetChar) return null;

  const morseItem = MORSE_CODE_MAP.find(item => item.char === targetChar);
  if (!morseItem) return null;

  const modes = Object.values(QuizMode);
  const randomMode = modes[Math.floor(Math.random() * modes.length)];

  let options: string[] | undefined;
  if (randomMode === QuizMode.LetterToMorse || randomMode === QuizMode.MorseToLetter) {
    options = [randomMode === QuizMode.LetterToMorse ? morseItem.morse : morseItem.char]; 
    const sourceArray = randomMode === QuizMode.LetterToMorse 
        ? MORSE_CODE_MAP.filter(i => i.morse !== morseItem.morse).map(item => item.morse) 
        : MORSE_CODE_MAP.filter(i => i.char !== morseItem.char).map(item => item.char);
    
    sourceArray.sort(() => Math.random() - 0.5);

    while (options.length < QUIZ_OPTIONS_COUNT && sourceArray.length > 0) {
        const randomOption = sourceArray.pop();
        if (randomOption && !options.includes(randomOption)) {
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


const Quiz: React.FC<QuizProps> = ({ 
    progressData, 
    onQuestionAnswered, 
    onSessionComplete, 
    settings, 
    userStats, 
    onShowSnackbar,
    playUiSound 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [typedMorse, setTypedMorse] = useState('');
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);
  const [questionsAnsweredInSession, setQuestionsAnsweredInSession] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const [lives, setLives] = useState(MAX_QUIZ_LIVES);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [quizSessionStats, setQuizSessionStats] = useState<QuizSessionStats>({ questionsCorrect: 0, questionsAttempted: 0, mistakesMade: 0 });

  const [quizRestartKey, setQuizRestartKey] = useState(0); // Used to trigger full quiz restart
  const advanceTimeoutRef = useRef<number | null>(null);

  const [animateScore, setAnimateScore] = useState(false);
  const [animateStreak, setAnimateStreak] = useState(false);
  const [animateLifeLost, setAnimateLifeLost] = useState<number | null>(null); // Store index of heart to animate


  const { isPlaying: isPlayingQuestionMorse, playMorse: playQuestionMorse, stopMorse: stopQuestionMorse } = 
    useMorsePlayer(settings.isProMode ? PRO_MODE_PLAYBACK_SPEED : settings.playbackSpeed, settings.soundEnabled);

  const { playMorse: playDitDahSound } = useMorsePlayer(
    settings.isProMode ? PRO_MODE_PLAYBACK_SPEED : settings.playbackSpeed, 
    settings.soundEnabled
  );


  const clearAdvanceTimeout = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };
  
  // Effect for cleaning up timeout on unmount
  useEffect(() => {
    return () => {
      clearAdvanceTimeout();
      stopQuestionMorse(); // Stop any sound if component unmounts
    };
  }, [stopQuestionMorse]);


  const startNewQuiz = useCallback(() => {
    clearAdvanceTimeout();
    stopQuestionMorse();
    setQuestionsAnsweredInSession(0);
    setQuizComplete(false);
    setLives(MAX_QUIZ_LIVES);
    setSessionScore(0);
    setSessionStreak(0);
    setFeedback(null);
    setQuizSessionStats({ questionsCorrect: 0, questionsAttempted: 0, mistakesMade: 0 });
    setUserAnswer('');
    setTypedMorse('');
    setIsQuestionTransitioning(false);
    
    const question = generateQuestion(progressData);
    setCurrentQuestion(question);
    if (question && question.mode === QuizMode.MorseToLetter && settings.soundEnabled) {
      playQuestionMorse(question.morse);
    }
  }, [progressData, settings.soundEnabled, playQuestionMorse, stopQuestionMorse]); // Removed direct dependency on playQuestionMorse by using local useMorsePlayer for it

  // Main effect to initialize or restart the quiz
  useEffect(() => {
    startNewQuiz();
  }, [quizRestartKey, startNewQuiz]); // Depends on quizRestartKey to re-trigger, and startNewQuiz which has its own deps


  const advanceToNextQuestion = useCallback(() => {
    setFeedback(null);
    setIsQuestionTransitioning(false); 
    setUserAnswer('');
    setTypedMorse('');

    if (lives <= 0) {
        onShowSnackbar(`Game Over! You ran out of lives. Score: ${sessionScore}`, 'error');
        setQuizComplete(true); 
        onSessionComplete(quizSessionStats);
        return;
    }
    if (questionsAnsweredInSession >= MAX_QUIZ_QUESTIONS) {
        setQuizComplete(true);
        onShowSnackbar(`Quiz session complete! Final Score: ${sessionScore}`, 'info');
        onSessionComplete(quizSessionStats);
        return;
    }

    const nextQ = generateQuestion(progressData);
    setCurrentQuestion(nextQ);

    if (nextQ && nextQ.mode === QuizMode.MorseToLetter && settings.soundEnabled) {
        // Ensure not already playing from a rapid previous correct answer sound
        if (!isPlayingQuestionMorse) {
             playQuestionMorse(nextQ.morse);
        }
    }
  }, [
      lives, questionsAnsweredInSession, sessionScore, 
      progressData, settings.soundEnabled, playQuestionMorse, isPlayingQuestionMorse,
      onShowSnackbar, onSessionComplete, quizSessionStats
  ]);


  const handleAnswerSubmit = (answer?: string) => {
    if (!currentQuestion || isQuestionTransitioning) return;

    clearAdvanceTimeout(); // Clear any pending advance from previous question
    stopQuestionMorse();   // Stop question morse if playing
    setIsQuestionTransitioning(true);

    const finalAnswer = answer !== undefined ? answer : (currentQuestion.mode === QuizMode.TypeItOut ? typedMorse : userAnswer);
    let isCorrect = false;
    let feedbackMsg = '';

    switch (currentQuestion.mode) {
      case QuizMode.LetterToMorse:
        isCorrect = finalAnswer.trim() === currentQuestion.morse;
        feedbackMsg = isCorrect ? 'Correct!' : `Incorrect. ${currentQuestion.character} is ${currentQuestion.morse}`;
        break;
      case QuizMode.MorseToLetter:
        isCorrect = finalAnswer.trim().toUpperCase() === currentQuestion.character.toUpperCase();
        feedbackMsg = isCorrect ? 'Correct!' : `Incorrect. ${currentQuestion.morse} is ${currentQuestion.character}`;
        break;
      case QuizMode.TypeItOut:
        isCorrect = finalAnswer.trim() === currentQuestion.morse;
        feedbackMsg = isCorrect ? 'Correct!' : `Incorrect. ${currentQuestion.character} is ${currentQuestion.morse}`;
        break;
    }
    
    const updatedSessionStats = {
      ...quizSessionStats,
      questionsAttempted: quizSessionStats.questionsAttempted + 1,
      questionsCorrect: quizSessionStats.questionsCorrect + (isCorrect ? 1 : 0),
      mistakesMade: quizSessionStats.mistakesMade + (isCorrect ? 0 : 1),
    };
    setQuizSessionStats(updatedSessionStats);

    let newSessionStreak = sessionStreak;
    if (isCorrect) {
      newSessionStreak = sessionStreak + 1;
      setSessionStreak(newSessionStreak);
      setSessionScore(prev => prev + 10 + (newSessionStreak * 2)); 
      setFeedback({type: 'correct', message: feedbackMsg, char: currentQuestion.character, morse: currentQuestion.morse});
      if(settings.soundEnabled) playUiSound(CORRECT_ANSWER_SOUND_MORSE);
      
      setAnimateScore(true); setTimeout(() => setAnimateScore(false), 300);
      if (newSessionStreak > 0) {
        setAnimateStreak(true); setTimeout(() => setAnimateStreak(false), 300);
      }
    } else {
      newSessionStreak = 0;
      setSessionStreak(newSessionStreak);
      setLives(prev => {
        const newLives = prev - 1;
        setAnimateLifeLost(newLives); // Animate the heart that corresponds to the new life count (index)
        setTimeout(() => setAnimateLifeLost(null), 400);
        return newLives;
      });
      setFeedback({type: 'incorrect', message: feedbackMsg, char: currentQuestion.character, morse: currentQuestion.morse});
      if(settings.soundEnabled) playUiSound(INCORRECT_ANSWER_SOUND_MORSE);
    }
    
    onQuestionAnswered(currentQuestion.character, isCorrect, newSessionStreak, updatedSessionStats);
    setQuestionsAnsweredInSession(prev => prev + 1);

    const feedbackDuration = settings.soundEnabled && isCorrect ? 1500 : 1200; // Slightly longer if playing morse for correct answer
    advanceTimeoutRef.current = window.setTimeout(advanceToNextQuestion, feedbackDuration);
  };
  
  const handleTypeItOutInput = (input: '.' | '-') => {
    if (isQuestionTransitioning) return;
    setTypedMorse(prev => prev + input);
    if(settings.soundEnabled) playDitDahSound(input); // Play only the dit or dah
  };

  const handleRestartQuiz = () => {
    setQuizRestartKey(prev => prev + 1); // This will trigger the useEffect to call startNewQuiz
  };


  if (quizComplete) {
    return (
        <div 
          className="p-6 text-center bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl border border-[var(--md-sys-color-outline-variant)] max-w-md mx-auto mt-4"
          style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
            <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-surface)] mb-2">
                {lives <=0 ? "Game Over!" : "Quiz Finished!"}
            </h2>
            <p className="text-[var(--md-sys-color-on-surface-variant)] mb-1">Final Score: <span className="text-[var(--md-sys-color-primary)] font-semibold">{sessionScore}</span></p>
            <p className="text-[var(--md-sys-color-on-surface-variant)] mb-1">Questions: {quizSessionStats.questionsCorrect} / {quizSessionStats.questionsAttempted}</p>
            {quizSessionStats.mistakesMade === 0 && quizSessionStats.questionsAttempted === MAX_QUIZ_QUESTIONS && (
                <p className="text-lg text-[var(--md-sys-color-tertiary)] my-2">🎉 Perfect Round! 🎉</p>
            )}
            <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6">Check your progress or start a new quiz.</p>
            <Button onClick={handleRestartQuiz} variant="filled">Start New Quiz</Button>
        </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-4 text-center text-[var(--md-sys-color-on-surface-variant)]">Loading question...</div>;
  }

  const renderMCQOptions = () => {
    if (!currentQuestion || !currentQuestion.options) return null;
    const optionRows: string[][] = [];
    for (let i = 0; i < currentQuestion.options.length; i += 2) {
        optionRows.push(currentQuestion.options.slice(i, i + 2));
    }
    return (
        <div className="space-y-2 mt-4">
            {optionRows.map((row, rowIndex) => (
                <div className="flex space-x-2" key={rowIndex}>
                    {row.map((opt) => (
                        <Button
                            key={opt}
                            variant="tonal"
                            onClick={() => handleAnswerSubmit(opt)}
                            disabled={isQuestionTransitioning}
                            className={`flex-1 !text-lg ${currentQuestion.mode === QuizMode.LetterToMorse ? '!font-mono !tracking-widest' : '!text-2xl'} !px-2 !py-3`}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    );
  };

  const renderInput = () => {
    switch (currentQuestion.mode) {
      case QuizMode.LetterToMorse:
        return (
          <>
            <p className="text-lg text-[var(--md-sys-color-on-surface-variant)] mb-2">Enter Morse for:</p>
            <p className="text-6xl font-bold text-[var(--md-sys-color-primary)] mb-6">{currentQuestion.character}</p>
            {currentQuestion.options ? renderMCQOptions() : (
                 <TextField
                    id="letterToMorseInput"
                    label="Type Morse code (e.g., .-)"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isQuestionTransitioning}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && !isQuestionTransitioning && handleAnswerSubmit()}
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
                <IconButton onClick={() => playQuestionMorse(currentQuestion.morse)} disabled={isPlayingQuestionMorse || isQuestionTransitioning} aria-label="Play Morse code">
                    <PlayArrowIcon />
                </IconButton>
            </div>
             {currentQuestion.options ? renderMCQOptions() : (
                <TextField
                  id="morseToLetterInput"
                  label="Type character"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                  disabled={isQuestionTransitioning}
                  autoFocus
                  maxLength={1}
                  onKeyDown={(e) => e.key === 'Enter' && !isQuestionTransitioning && handleAnswerSubmit()}
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
            <div className="flex space-x-2 mb-4">
              <Button onClick={() => handleTypeItOutInput('.')} leadingIcon={<DotIcon />} disabled={isQuestionTransitioning} variant="tonal" className="!h-14 flex-1 !px-4">Dit</Button>
              <Button onClick={() => handleTypeItOutInput('-')} leadingIcon={<DashIcon />} disabled={isQuestionTransitioning} variant="tonal" className="!h-14 flex-1 !px-4">Dah</Button>
            </div>
            <div className="flex space-x-2">
                <Button onClick={() => setTypedMorse('')} variant="outlined" disabled={isQuestionTransitioning || typedMorse.length === 0} className="flex-1 !px-4">Clear</Button>
                <Button onClick={() => handleAnswerSubmit()} disabled={isQuestionTransitioning || typedMorse.length === 0} className="flex-1 !px-4">Submit</Button>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-full max-w-md mb-4 p-3 bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-lg)] shadow-md flex justify-around items-center text-sm"
           style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
        <div className="flex items-center" title="Lives">
          {Array.from({ length: MAX_QUIZ_LIVES }).map((_, i) => (
            <HeartIcon 
              key={i} 
              className={`w-6 h-6 transition-colors duration-200 ${i < lives ? 'text-[var(--md-sys-color-error)]' : 'text-[var(--md-sys-color-outline)]'} ${animateLifeLost === i ? 'animate-shake-heart' : ''}`} 
            />
          ))}
        </div>
        <div className={`flex items-center text-[var(--md-sys-color-on-surface-variant)] ${animateScore ? 'animate-pop' : ''}`} title="Score">
          <StarIcon className="w-5 h-5 mr-1 text-[var(--md-sys-color-primary)]" /> Score: {sessionScore}
        </div>
        <div className={`flex items-center text-[var(--md-sys-color-on-surface-variant)] ${animateStreak ? 'animate-pop' : ''}`} title="Streak">
          <FlameIcon className="w-5 h-5 mr-1 text-[var(--md-sys-color-tertiary)]" /> Streak: {sessionStreak}
        </div>
      </div>
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-background)] mb-1">Quiz Time!</h2>
      <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-4">Question {Math.min(questionsAnsweredInSession + 1, MAX_QUIZ_QUESTIONS)} of {MAX_QUIZ_QUESTIONS}</p>
      
      <div 
        className="w-full max-w-md p-6 bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-lg)] shadow-xl border border-[var(--md-sys-color-outline-variant)] relative"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)' 
        }}
      >
        {feedback && isQuestionTransitioning && ( // Only show feedback when isQuestionTransitioning is true
            <div 
              className={`absolute top-0 left-0 right-0 p-3 text-center text-sm font-medium rounded-t-[var(--md-sys-shape-corner-lg)]
                          ${feedback.type === 'correct' ? 'bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]' : 'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]'}
                          animate-pulse-once`} 
            >
              {feedback.type === 'correct' ? 
                <CheckCircleIcon className="inline w-5 h-5 mr-1 align-middle"/> : 
                <CancelIcon className="inline w-5 h-5 mr-1 align-middle"/>
              }
              <span className="align-middle">{feedback.message}</span>
            </div>
        )}
        <div className={feedback && isQuestionTransitioning ? 'mt-10 pt-2' : 'pt-2'}> {/* Add margin if feedback is shown to prevent overlap */}
            {renderInput()}
        </div>
        {((currentQuestion.mode === QuizMode.LetterToMorse && !currentQuestion.options) || (currentQuestion.mode === QuizMode.MorseToLetter && !currentQuestion.options)) && (
            <Button onClick={() => handleAnswerSubmit()} disabled={isQuestionTransitioning || userAnswer.length === 0} className="w-full mt-6">
                Submit
            </Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;