'use client';

import { useState, useCallback, useRef } from 'react';
import { getLanguageInfo } from '../translation/languages.config';

export function useSTT(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const recognitionRef = useRef<unknown>(null);

  const startListening = useCallback(
    (sourceLang: string = 'en') => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        alert('Voice recognition is not supported in this browser. Please use Chrome, Safari, or Edge.');
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognitionRef.current = recognition;

        const langInfo = getLanguageInfo(sourceLang);
        recognition.lang = langInfo?.ttsCode || (sourceLang === 'auto' ? 'en-US' : sourceLang);
        recognition.continuous = false;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onstart = () => {
          setIsListening(true);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            onTranscript(currentTranscript);
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    },
    [onTranscript]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
}
