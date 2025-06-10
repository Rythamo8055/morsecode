
import { useCallback, useRef, useEffect, useState } from 'react';
import { INITIAL_DOT_DURATION_MS } from '../constants';

interface MorsePlayerControls {
  playMorseCode: (code: string, isProMode?: boolean) => Promise<void>;
  isPlaying: boolean;
  setBaseUnitDuration: (duration: number) => void;
  baseUnitDuration: number;
}

const useMorsePlayer = (soundGloballyEnabled: boolean): MorsePlayerControls => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [baseUnitDuration, setBaseUnitDuration] = useState<number>(INITIAL_DOT_DURATION_MS);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (soundGloballyEnabled && !audioContextRef.current && typeof window !== 'undefined') {
       try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
       } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
        // User will be informed via UI if sound can't be enabled
       }
    }
    // Note: AudioContext is not closed here to allow quick toggling of sound on/off globally
    // without destroying and recreating the context repeatedly, which can be resource-intensive.
    // It will be closed if the component using the hook unmounts, or could be managed more globally.
  }, [soundGloballyEnabled]);

  const playSignal = useCallback(async (duration: number, frequency: number = 600) => {
    if (!soundGloballyEnabled || !audioContextRef.current) {
        return;
    }
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (e) {
        console.error("Could not resume audio context", e);
        return;
      }
    }
    
    // Stop and disconnect any existing oscillator and gain node
    if (oscillatorRef.current) {
        try {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
        } catch (e) { /* ignore if already stopped or disconnected */ }
        oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
        try {
            gainNodeRef.current.disconnect();
        } catch (e) { /* ignore if already disconnected */ }
        gainNodeRef.current = null;
    }

    const ac = audioContextRef.current;
    const oscillator = ac.createOscillator();
    const gainNode = ac.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ac.currentTime);
    
    // Smooth attack and release to prevent clicks
    gainNode.gain.setValueAtTime(0, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ac.currentTime + 0.01); // Quick fade in
    
    oscillator.connect(gainNode);
    gainNode.connect(ac.destination);
    
    oscillator.start(ac.currentTime);
    
    // Schedule stop and fade out
    const stopTime = ac.currentTime + duration / 1000;
    gainNode.gain.setValueAtTime(0.5, stopTime - 0.01); // Hold volume
    gainNode.gain.linearRampToValueAtTime(0, stopTime); // Quick fade out
    oscillator.stop(stopTime);

    oscillatorRef.current = oscillator; 
    gainNodeRef.current = gainNode;

    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        // Ensure cleanup if oscillator didn't stop itself correctly or if promise resolves early
        if (oscillatorRef.current === oscillator) { // only stop if it's the current one
             try {
                oscillator.disconnect();
                gainNode.disconnect();
             } catch(e) {/* already stopped or disconnected */}
             oscillatorRef.current = null;
             gainNodeRef.current = null;
        }
        resolve();
      }, duration + 50); // Add a small buffer

      oscillator.onended = () => {
        clearTimeout(timer);
         if (oscillatorRef.current === oscillator) {
            try {
                gainNode.disconnect(); // Oscillator disconnects itself
            } catch(e) {/* already stopped or disconnected */}
            oscillatorRef.current = null;
            gainNodeRef.current = null;
        }
        resolve();
      };
    });
  }, [soundGloballyEnabled]);

  const playMorseCode = useCallback(async (code: string, isProMode: boolean = false) => {
    if (!soundGloballyEnabled || isPlaying || !audioContextRef.current) return;
    setIsPlaying(true);

    const unit = isProMode ? baseUnitDuration / 1.75 : baseUnitDuration; // Pro mode is faster
    const dotDuration = unit;
    const dashDuration = unit * 3;
    const intraCharSpace = unit; 

    for (let i = 0; i < code.length; i++) {
      const symbol = code[i];
      if (symbol === '.') {
        await playSignal(dotDuration);
      } else if (symbol === '-') {
        await playSignal(dashDuration);
      } else if (symbol === ' ') { 
        await new Promise(resolve => setTimeout(resolve, unit * 3)); 
      } else if (symbol === '/') { 
         await new Promise(resolve => setTimeout(resolve, unit * 7));
      }
      
      // Add intra-character space if not the last symbol and not a word/letter space
      if (symbol !== ' ' && symbol !== '/' && i < code.length - 1 && code[i+1] !== ' ' && code[i+1] !== '/') {
         await new Promise(resolve => setTimeout(resolve, intraCharSpace));
      }
    }
    setIsPlaying(false);
  }, [soundGloballyEnabled, playSignal, isPlaying, baseUnitDuration]);


  // Cleanup audio context on unmount
  useEffect(() => {
    const ac = audioContextRef.current;
    return () => {
      if (ac && ac.state !== 'closed') {
        // Stop any active sound
        if (oscillatorRef.current) {
            try { oscillatorRef.current.stop(); oscillatorRef.current.disconnect(); } catch(e){}
        }
        if (gainNodeRef.current) {
            try { gainNodeRef.current.disconnect(); } catch(e){}
        }
        ac.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, []);

  return { playMorseCode, isPlaying, setBaseUnitDuration, baseUnitDuration };
};

export default useMorsePlayer;
