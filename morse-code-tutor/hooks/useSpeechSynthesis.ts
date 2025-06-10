import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeechSynthesisControls {
  speak: (text: string, onEnd?: () => void) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  isAvailable: boolean;
}

const useSpeechSynthesis = (): SpeechSynthesisControls => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false); // If voices are loaded
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndCallbackRef = useRef<(() => void) | null | undefined>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const synth = window.speechSynthesis;
      
      const checkVoices = () => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          setIsAvailable(true);
        } else {
          // Voices might load asynchronously
          if(synth.onvoiceschanged !== undefined) {
             synth.onvoiceschanged = () => setIsAvailable(synth.getVoices().length > 0);
          } else {
            // Fallback for browsers that don't support onvoiceschanged well initially
            // Try checking after a short delay, but this is less reliable
            setTimeout(() => setIsAvailable(synth.getVoices().length > 0), 500);
          }
        }
      };
      checkVoices();

    } else {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false);
    if (onEndCallbackRef.current) {
      onEndCallbackRef.current();
      onEndCallbackRef.current = null; // Clear after calling
    }
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSupported || !isAvailable || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported or not available.');
      onEnd?.();
      return;
    }

    const synth = window.speechSynthesis;
    
    // Cancel any ongoing speech before starting a new one
    if (synth.speaking) {
      synth.cancel(); // This should trigger 'end' on the previous utterance.
    }

    // Ensure state is reset if cancel didn't immediately fire handleSpeechEnd
    setIsSpeaking(false); 
    if (onEndCallbackRef.current) {
        onEndCallbackRef.current(); // Call previous onEnd if it exists and wasn't cleared
        onEndCallbackRef.current = null;
    }


    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    onEndCallbackRef.current = onEnd;

    // Optional: Configure voice, rate, pitch
    const voices = synth.getVoices();
    // Example: Try to find an English voice
    let voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
    if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    
    utterance.pitch = 1;
    utterance.rate = 0.9; // Slightly slower for clarity with mnemonics
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = handleSpeechEnd;
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      handleSpeechEnd(); // Treat error as end
    };
    
    synth.speak(utterance);
  }, [isSupported, isAvailable, handleSpeechEnd]);

  const cancel = useCallback(() => {
    if (isSupported && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // handleSpeechEnd will be called by the 'onend' event of the utterance
    }
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isSupported, isAvailable };
};

export default useSpeechSynthesis;