'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Check,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_PRESETS,
  getLanguageInfo,
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const applyPreset = (presetLangs: string[]) => {
    onChange(presetLangs);
  };

  // Selected languages objects for the compact preview pill
  const selectedInfoList = selectedLanguages
    .map((code) => getLanguageInfo(code))
    .filter(Boolean) as LanguageInfo[];

  return (
    <div className="w-full space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Left: Title + Counter + Visual preview */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 group text-left cursor-pointer select-none py-0.5"
          aria-expanded={isExpanded}
        >
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Translate Into
          </span>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40 shadow-2xs">
            {selectedLanguages.length}
          </span>

          {/* Clean flag stack preview when collapsed */}
          {!isExpanded && selectedInfoList.length > 0 && (
            <div className="flex items-center -space-x-1.5 ml-1">
              {selectedInfoList.slice(0, 5).map((info) => (
                <div
                  key={info.code}
                  className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] shadow-2xs"
                  title={info.name}
                >
                  {info.flag}
                </div>
              ))}
              {selectedInfoList.length > 5 && (
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300">
                  +{selectedInfoList.length - 5}
                </div>
              )}
            </div>
          )}

          <div
            className={`p-1 rounded-md text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Expand / Collapse Text button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Quick Bar</span>
              </>
            )}
          </button>

          {/* Full Searchable Modal Trigger */}
          <button
            id="open-language-selector-btn"
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-200/70 dark:border-blue-800/50 transition-all cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Languages ({SUPPORTED_LANGUAGES.length})</span>
          </button>
        </div>
      </div>

      {/* Collapsible Quick Bar */}
      {isExpanded && (
        <div className="space-y-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Presets row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Sparkles className="w-3 h-3 text-blue-500" /> Presets:
            </span>
            {LANGUAGE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.languages)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap cursor-pointer text-xs font-medium transition-all hover:border-blue-400 shadow-2xs"
              >
                <span>{preset.icon}</span>
                <span>{preset.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({preset.languages.length})</span>
              </button>
            ))}
          </div>

          {/* Popular languages chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {popularLanguages.map((lang: LanguageInfo) => {
              const isSelected = selectedLanguages.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLang(lang.code)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
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

            {/* More button opening full modal */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 cursor-pointer transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>More ({SUPPORTED_LANGUAGES.length - popularLanguages.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Searchable Modal */}
      <LanguageSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLanguages={selectedLanguages}
        onChange={onChange}
      />
    </div>
  );
}
