'use client';

import React from 'react';
import { Columns, Volume2, Copy, Check } from 'lucide-react';
import { TranslationItem } from '@/lib/translation/types';
import { useTTS } from '@/lib/speech/useTTS';

interface CompareViewProps {
  translations: TranslationItem[];
  sourceText: string;
  sourceLanguage: string;
}

export function CompareView({
  translations,
  sourceText,
  sourceLanguage,
}: CompareViewProps) {
  const { speak, playingId } = useTTS();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const successfulTranslations = translations.filter((t) => t.status === 'success');

  if (successfulTranslations.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
        No translations available to compare yet. Enter text and click Translate.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Columns className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Side-by-Side Comparison
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          Source: {sourceText.slice(0, 40)}
          {sourceText.length > 40 ? '...' : ''}
        </span>
      </div>

      {/* Comparative Matrix: 2-column comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {successfulTranslations.map((item) => (
          <div
            key={item.language}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:border-blue-300 dark:hover:border-slate-700 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.languageName}
                    </h3>
                    <p className="text-xs text-slate-400">{item.nativeName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speak(item.text, item.language, `cmp_${item.language}`)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.text, item.language)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Copy"
                  >
                    {copiedId === item.language ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Parallel Comparison: Source vs Target */}
              <div className="space-y-2.5 text-sm">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs">
                  <span className="font-semibold text-slate-400 dark:text-slate-500 block mb-0.5 uppercase tracking-wider text-[10px]">
                    Original ({sourceLanguage})
                  </span>
                  <p>{sourceText}</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30 text-slate-900 dark:text-slate-100 font-medium">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-0.5 uppercase tracking-wider text-[10px]">
                    Translation ({item.languageName})
                  </span>
                  <p dir={item.direction}>{item.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
