'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  RotateCcw,
  Layers,
  Globe2,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_PRESETS,
  DEFAULT_TARGET_LANGUAGES,
  LanguageInfo,
} from '@/lib/translation/languages.config';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

export function LanguageSelectorModal({
  isOpen,
  onClose,
  selectedLanguages,
  onChange,
}: LanguageSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: `All (${SUPPORTED_LANGUAGES.length})` },
    { id: 'popular', label: 'Popular' },
    { id: 'indian', label: 'Indian 🇮🇳' },
    { id: 'european', label: 'European 🇪🇺' },
    { id: 'asian', label: 'Asian 🌏' },
    { id: 'middle-eastern', label: 'Middle East 🕌' },
    { id: 'african', label: 'African 🌍' },
    { id: 'americas', label: 'Americas 🌎' },
    { id: 'historical', label: 'Historical & Ancient 🏛️' },
  ];

  const filteredLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter((lang) => {
      // Search query filter
      const matchesSearch =
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (activeCategory === 'all') return true;
      if (activeCategory === 'popular') return lang.popular;
      return lang.category === activeCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleLanguage = (code: string) => {
    if (selectedLanguages.includes(code)) {
      if (selectedLanguages.length <= 1) {
        alert('Please keep at least one target language selected.');
        return;
      }
      onChange(selectedLanguages.filter((l) => l !== code));
    } else {
      onChange([...selectedLanguages, code]);
    }
  };

  const handleSelectAll = () => {
    const allCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    onChange(allCodes);
  };

  const handleClearAll = () => {
    // Keep at least English
    onChange(['en']);
  };

  const handleApplyPreset = (presetLangs: string[]) => {
    onChange(presetLangs);
  };

  const handleResetDefaults = () => {
    onChange(DEFAULT_TARGET_LANGUAGES);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                Select Target Languages
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose multiple languages to translate simultaneously
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Presets:
          </span>
          {LANGUAGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.languages)}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer hover:border-blue-400"
            >
              {preset.icon} {preset.name}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
          <button
            onClick={handleSelectAll}
            className="px-2 py-1 rounded text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer"
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            className="px-2 py-1 rounded text-slate-500 hover:text-red-500 whitespace-nowrap cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={handleResetDefaults}
            className="px-2 py-1 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 whitespace-nowrap cursor-pointer"
            title="Reset to default 6 languages"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search languages by English or native script (e.g. Malayalam, हिन्दी, Español)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {filteredLanguages.map((lang: LanguageInfo) => {
            const isSelected = selectedLanguages.includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600/70 text-blue-900 dark:text-blue-100 shadow-xs'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{lang.flag}</span>
                  <div className="truncate">
                    <p className="font-semibold text-sm truncate">{lang.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {lang.nativeName}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-400 text-sm">
              No languages found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
              {selectedLanguages.length}
            </span>{' '}
            languages selected
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  );
}
