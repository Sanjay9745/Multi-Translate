'use client';

import React from 'react';
import {
  GraduationCap,
  Volume2,
  Copy,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { TranslationItem } from '@/lib/translation/types';
import { useTTS } from '@/lib/speech/useTTS';

interface LearningViewProps {
  translations: TranslationItem[];
  sourceText: string;
  sourceLanguage: string;
}

export function LearningView({
  translations,
  sourceText,
  sourceLanguage,
}: LearningViewProps) {
  const { speak, playingId } = useTTS();
  const successfulTranslations = translations.filter((t) => t.status === 'success');

  if (successfulTranslations.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
        No translations available for learning mode yet. Translate something above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
            Language Learning & Pronunciation Lab
          </h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-medium">
          Detailed Linguistic Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {successfulTranslations.map((item) => {
          const isSpeaking = playingId === `learn_${item.language}`;
          return (
            <div
              key={item.language}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 hover:border-indigo-200 dark:hover:border-indigo-950 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {item.languageName}
                    </h3>
                    <p className="text-xs text-slate-400">{item.nativeName}</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    speak(item.text, item.language, `learn_${item.language}`)
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Playing...' : 'Pronounce'}</span>
                </button>
              </div>

              {/* Translation with Large Typography */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Phrase
                </span>
                <p
                  dir={item.direction}
                  className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug"
                >
                  {item.text}
                </p>
              </div>

              {/* Transliteration / Romanization */}
              <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Phonetic Transliteration:</span>
                </div>
                <p className="font-mono text-slate-800 dark:text-slate-200 pl-5">
                  {item.learning?.transliteration ||
                    `/${item.text.toLowerCase()}/`}
                </p>
              </div>

              {/* Pronunciation & Literal Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Native Pronunciation
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    {item.learning?.pronunciation ||
                      `Spoken natively with ${item.languageName} vocal cadences.`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Grammar & Tone
                  </span>
                  <p className="text-slate-500 dark:text-slate-400">
                    {item.learning?.literalMeaning ||
                      `Contextual equivalent of &ldquo;${sourceText.slice(0, 30)}&rdquo;`}
                  </p>
                </div>
              </div>

              {/* Real-world Example Sentence */}
              <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Practical
                  Usage:
                </span>
                <p className="text-slate-500 dark:text-slate-400 italic">
                  &ldquo;
                  {item.learning?.exampleSentence?.source ||
                    sourceText}
                  &rdquo;
                </p>
                <p
                  dir={item.direction}
                  className="text-slate-900 dark:text-slate-100 font-semibold"
                >
                  &ldquo;
                  {item.learning?.exampleSentence?.target || item.text}
                  &rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
