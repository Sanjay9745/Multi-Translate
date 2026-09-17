'use client';

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  Heart,
  Share2,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TranslationItem } from '@/lib/translation/types';
import { useTTS } from '@/lib/speech/useTTS';
import { useFavorites } from '@/lib/storage/useFavorites';

interface TranslationCardProps {
  item: TranslationItem;
  sourceText: string;
  sourceLanguage: string;
  onRetry?: (languageCode: string) => void;
  isLearningMode?: boolean;
}

export function TranslationCard({
  item,
  sourceText,
  sourceLanguage,
  onRetry,
  isLearningMode = false,
}: TranslationCardProps) {
  const [copied, setCopied] = useState(false);
  const [showLearningDetails, setShowLearningDetails] = useState(isLearningMode);
  const { isSupported: ttsSupported, playingId, speak, stop } = useTTS();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isSpeaking = playingId === `tts_${item.language}`;
  const isStarred = isFavorite(sourceText, item.language);

  const handleCopy = async () => {
    if (!item.text) return;
    try {
      await navigator.clipboard.writeText(item.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleTTS = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(item.text, item.language, `tts_${item.language}`);
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      sourceText,
      sourceLanguage,
      targetLanguage: item.language,
      languageName: item.languageName,
      flag: item.flag,
      translatedText: item.text,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `MultiTranslate: ${item.languageName}`,
      text: `${sourceText}\n\n→ ${item.languageName} (${item.flag}):\n${item.text}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or unsupported
      }
    } else {
      // Fallback copy full share text
      await navigator.clipboard.writeText(shareData.text);
      alert('Translation summary copied to clipboard for sharing!');
    }
  };

  return (
    <div
      className={`group rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        item.status === 'error'
          ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-slate-700'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-4.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0 select-none">{item.flag}</span>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                {item.languageName}
              </h3>
              {item.direction === 'rtl' && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                  RTL
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">
              {item.nativeName}
            </p>
          </div>
        </div>

        {/* Action icons right */}
        <div className="flex items-center gap-1">
          {item.status === 'success' && (
            <>
              {/* Favorite */}
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isStarred
                    ? 'text-red-500 bg-red-50 dark:bg-red-950/50'
                    : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isStarred ? 'Remove from favorites' : 'Add to favorites'}
                aria-label="Favorite translation"
              >
                <Heart
                  className={`w-4 h-4 ${isStarred ? 'fill-red-500 stroke-red-500' : ''}`}
                />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Share translation"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-center">
        {item.status === 'success' ? (
          <div className="space-y-3">
            <p
              dir={item.direction}
              className={`text-base sm:text-lg text-slate-900 dark:text-slate-100 font-normal leading-relaxed break-words select-text ${
                item.direction === 'rtl' ? 'text-right' : 'text-left'
              }`}
            >
              {item.text}
            </p>

            {/* Transliteration badge if present */}
            {item.learning?.transliteration && (
              <div className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-600 dark:text-slate-300 not-italic mr-1.5">
                  Phonetic:
                </span>
                {item.learning.transliteration}
              </div>
            )}

            {/* Learning details drawer */}
            {item.learning && (
              <div className="pt-2">
                <button
                  onClick={() => setShowLearningDetails(!showLearningDetails)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {showLearningDetails ? 'Hide Learning Guide' : 'View Learning Guide'}
                  </span>
                  {showLearningDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {showLearningDetails && (
                  <div className="mt-2.5 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs space-y-2 animate-in fade-in duration-150">
                    {item.learning.pronunciation && (
                      <div>
                        <span className="font-semibold text-blue-900 dark:text-blue-200">
                          Pronunciation:
                        </span>{' '}
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.learning.pronunciation}
                        </span>
                      </div>
                    )}
                    {item.learning.literalMeaning && (
                      <div>
                        <span className="font-semibold text-blue-900 dark:text-blue-200">
                          Context / Meaning:
                        </span>{' '}
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.learning.literalMeaning}
                        </span>
                      </div>
                    )}
                    {item.learning.exampleSentence && (
                      <div className="pt-1 border-t border-blue-200/50 dark:border-blue-800/40">
                        <span className="font-semibold text-blue-900 dark:text-blue-200 block mb-0.5">
                          Example:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 italic">
                          &ldquo;{item.learning.exampleSentence.source}&rdquo;
                        </p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          &ldquo;{item.learning.exampleSentence.target}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-2">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {item.error || 'Translation temporarily unavailable'}
            </p>
            {onRetry && (
              <button
                onClick={() => onRetry(item.language)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Listen & Copy buttons */}
      {item.status === 'success' && (
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-b-2xl border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {/* TTS Listen */}
          <button
            onClick={handleTTS}
            disabled={!ttsSupported}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
            }`}
            title="Listen to pronunciation (Web Speech TTS)"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                <span>Stop</span>
                {/* Audio waves */}
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 bg-white rounded-full animate-wave-1" />
                  <span className="w-1 bg-white rounded-full animate-wave-2" />
                  <span className="w-1 bg-white rounded-full animate-wave-3" />
                </div>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
            }`}
            title="Copy translation"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
