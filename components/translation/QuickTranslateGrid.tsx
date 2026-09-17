'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Sparkles,
} from 'lucide-react';
import { TranslationItem } from '@/lib/translation/types';
import { getLanguageInfo } from '@/lib/translation/languages.config';
import { TranslationCard } from './TranslationCard';

interface QuickTranslateGridProps {
  translations: TranslationItem[];
  sourceText: string;
  sourceLanguage: string;
  isLoading: boolean;
  targetLanguages: string[];
  onRetrySingle?: (langCode: string) => void;
  isLearningMode?: boolean;
}

export function QuickTranslateGrid({
  translations,
  sourceText,
  sourceLanguage,
  isLoading,
  targetLanguages,
  onRetrySingle,
  isLearningMode = false,
}: QuickTranslateGridProps) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    if (translations.length === 0) return;
    const compiled = translations
      .filter((t) => t.status === 'success')
      .map((t) => `${t.flag} ${t.languageName}:\n${t.text}`)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(compiled);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareAll = async () => {
    const compiled = translations
      .filter((t) => t.status === 'success')
      .map((t) => `${t.flag} ${t.languageName}:\n${t.text}`)
      .join('\n\n');

    const shareData = {
      title: 'MultiTranslate Results',
      text: `Original (${sourceLanguage}):\n${sourceText}\n\n${compiled}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelled
      }
    } else {
      handleCopyAll();
      alert('All translations copied to clipboard for sharing!');
    }
  };

  // If loading and no translations yet, render skeletons for selected target languages
  if (isLoading && translations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Translating simultaneously into {targetLanguages.length} languages...
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targetLanguages.map((langCode) => {
            const langInfo = getLanguageInfo(langCode);
            return (
              <div
                key={langCode}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-center flex items-center justify-center text-lg">
                    {langInfo?.flag || '🌐'}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (translations.length === 0) {
    return null;
  }

  const successCount = translations.filter((t) => t.status === 'success').length;

  return (
    <div className="space-y-4">
      {/* Header with stats and actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <span>Translations</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {successCount} / {translations.length} Ready
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
            title="Copy all translations"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied All</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>

          <button
            onClick={handleShareAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
            title="Share all translations"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share All</span>
          </button>
        </div>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {translations.map((item) => (
          <TranslationCard
            key={item.language}
            item={item}
            sourceText={sourceText}
            sourceLanguage={sourceLanguage}
            onRetry={onRetrySingle}
            isLearningMode={isLearningMode}
          />
        ))}
      </div>
    </div>
  );
}
