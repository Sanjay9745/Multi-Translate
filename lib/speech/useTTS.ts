'use client';

import { useState, useEffect, useCallback } from 'react';
import { getLanguageInfo } from '../translation/languages.config';

export function useTTS() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  const speak = useCallback(
    (text: string, langCode: string, id: string, rate: number = 1.0) => {
      if (!isSupported || !window.speechSynthesis) return;

      // If already playing this ID, stop it
      if (playingId === id) {
        window.speechSynthesis.cancel();
        setPlayingId(null);
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;

      const langInfo = getLanguageInfo(langCode);
      const targetBcp47 = langInfo?.ttsCode || langCode;
      utterance.lang = targetBcp47;

      // Try to find the closest matching voice
      if (voices.length > 0) {
        const baseLang = langCode.toLowerCase().split('-')[0];
        const matchingVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase() === targetBcp47.toLowerCase() ||
              v.lang.toLowerCase().replace('_', '-') === targetBcp47.toLowerCase()
          ) ||
          voices.find((v) => v.lang.toLowerCase().startsWith(baseLang));

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        setPlayingId(id);
      };

      utterance.onend = () => {
        setPlayingId(null);
      };

      utterance.onerror = () => {
        setPlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, playingId, voices]
  );

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
    }
  }, []);

  return {
    isSupported,
    playingId,
    speak,
    stop,
  };
}
