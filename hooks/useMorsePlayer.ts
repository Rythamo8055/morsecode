
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MorsePlayerState {
  isPlaying: boolean;
  playMorse: (morseCode: string, onEnd?: () => void) => void;
  stopMorse: () => void;
}

const useMorsePlayer = (dotDurationMs: number, soundEnabled: boolean): MorsePlayerState => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutIdsRef.current.forEach(clearTimeout);
    timeoutIdsRef.current = [];
  }, []);
  
  const setupAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new window.AudioContext();
    }
     // Resume context on user gesture if needed (browsers often require this)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(console.error);
    }
    return audioContextRef.current;
  }, []);


  useEffect(() => {
    setupAudioContext();
    return () => {
      clearTimeouts();
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
       // audioContextRef.current.close().catch(console.error); // Do not close, reuse
      }
    };
  }, [clearTimeouts, setupAudioContext]);

  const playSound = useCallback((durationSeconds: number) => {
    const context = setupAudioContext();
    if (!context || !soundEnabled) return;

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }
    
    oscillatorRef.current = context.createOscillator();
    gainNodeRef.current = context.createGain();

    oscillatorRef.current.type = 'sine';
    oscillatorRef.current.frequency.setValueAtTime(600, context.currentTime); // Hz
    gainNodeRef.current.gain.setValueAtTime(0.3, context.currentTime); // Volume

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(context.destination);

    oscillatorRef.current.start();
    oscillatorRef.current.stop(context.currentTime + durationSeconds);
  }, [soundEnabled, setupAudioContext]);

  const playMorse = useCallback((morseCode: string, onEnd?: () => void) => {
    if (isPlaying || !soundEnabled) {
      if(onEnd) onEnd(); // If not playing or sound disabled, call onEnd immediately
      return;
    }
    setupAudioContext(); // Ensure context is ready

    setIsPlaying(true);
    clearTimeouts();

    let currentTime = 0;
    const dotSec = dotDurationMs / 1000;
    const dashSec = dotSec * 3;
    const intraCharSpaceSec = dotSec; // Space between dits/dahs in a char
    // const interCharSpaceSec = dotSec * 3; // Space between characters (not handled here, assuming single char)
    // const wordSpaceSec = dotSec * 7; // Space between words

    const playUnit = (unit: string) => {
      if (unit === '.') {
        playSound(dotSec);
        return dotSec;
      } else if (unit === '-') {
        playSound(dashSec);
        return dashSec;
      }
      return 0;
    };
    
    const schedulePlay = (codeArray: string[], index: number) => {
      if (index >= codeArray.length) {
        const finalTimeoutId = setTimeout(() => {
          setIsPlaying(false);
          if (onEnd) onEnd();
        }, (currentTime + intraCharSpaceSec) * 1000); // Add a final small delay
        timeoutIdsRef.current.push(finalTimeoutId);
        return;
      }

      const char = codeArray[index];
      const duration = playUnit(char);
      
      const nextDelay = (duration + intraCharSpaceSec) * 1000;
      currentTime += duration + intraCharSpaceSec;

      const timeoutId = setTimeout(() => {
        schedulePlay(codeArray, index + 1);
      }, nextDelay);
      timeoutIdsRef.current.push(timeoutId);
    };

    const codeArray = morseCode.split('');
    if (codeArray.length > 0) {
       // Start the first sound immediately
       const firstChar = codeArray[0];
       const firstDuration = playUnit(firstChar);
       currentTime += firstDuration + intraCharSpaceSec;
       
       if (codeArray.length > 1) {
         const firstTimeoutId = setTimeout(() => {
           schedulePlay(codeArray, 1);
         }, (firstDuration + intraCharSpaceSec) * 1000);
         timeoutIdsRef.current.push(firstTimeoutId);
       } else {
         const singleCharTimeoutId = setTimeout(() => {
           setIsPlaying(false);
           if (onEnd) onEnd();
         }, (firstDuration + intraCharSpaceSec) * 1000);
         timeoutIdsRef.current.push(singleCharTimeoutId);
       }
    } else {
        setIsPlaying(false);
        if (onEnd) onEnd();
    }

  }, [isPlaying, dotDurationMs, playSound, clearTimeouts, soundEnabled, setupAudioContext]);

  const stopMorse = useCallback(() => {
    clearTimeouts();
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }
    setIsPlaying(false);
  }, [clearTimeouts]);

  return { isPlaying, playMorse, stopMorse };
};

export default useMorsePlayer;
