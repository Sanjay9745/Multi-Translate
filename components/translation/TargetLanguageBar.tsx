'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Check,
  Plus,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LanguageInfo,
} from '@/lib/translation/languages.config';
import { LanguageSelectorModal } from './LanguageSelectorModal';

interface TargetLanguageBarProps {
  selectedLanguages: string[];
  onChange: (langs: string[]) => void;
}

export function TargetLanguageBar({
  selectedLanguages,
  onChange,
}: TargetLanguageBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Popular languages for fast 1-click toggling
  const popularLanguages = SUPPORTED_LANGUAGES.filter((l) => l.popular);

  const toggleLang = (code: string) => {
    if (selectedLanguages.includes(code)) {
      if (selectedLanguages.length <= 1) {
        alert('Keep at least one target language selected.');
        return;
      }
      onChange(selectedLanguages.filter((l) => l !== code));
    } else {
      onChange([...selectedLanguages, code]);
    }
  };

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Translate Into
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            {selectedLanguages.length} selected
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200/60 dark:border-blue-800/40 transition-colors cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>All Languages ({SUPPORTED_LANGUAGES.length})</span>
        </button>
      </div>

      {/* Scrollable / wrap chips of popular languages */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {popularLanguages.map((lang: LanguageInfo) => {
          const isSelected = selectedLanguages.includes(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => toggleLang(lang.code)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {isSelected ? (
                <Check className="w-3 h-3 stroke-[3]" />
              ) : (
                <Plus className="w-3 h-3 opacity-40" />
              )}
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>More ({SUPPORTED_LANGUAGES.length - popularLanguages.length})</span>
        </button>
      </div>

      <LanguageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLanguages={selectedLanguages}
        onChange={onChange}
      />
    </div>
  );
}
