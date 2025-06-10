
import React, { useState, useEffect, useCallback } from 'react';

interface SpeechSynthesisState {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string) => void;
  cancel: () => void;
}

const useSpeechSynthesis = (soundEnabled: boolean): SpeechSynthesisState => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !soundEnabled || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false); // Handle errors

    window.speechSynthesis.speak(utterance);
  }, [isSupported, soundEnabled, isSpeaking]);

  const cancel = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);
  
  useEffect(() => {
    return () => { // Cleanup on unmount
      if (isSupported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);


  return { isSpeaking, isSupported, speak, cancel };
};

export default useSpeechSynthesis;
