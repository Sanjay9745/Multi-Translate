'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  RotateCcw,
  Layers,
  Globe2,
  CheckCheck,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_PRESETS,
  DEFAULT_TARGET_LANGUAGES,
  LanguageInfo,
  getLanguageInfo,
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
  const [showSelectedPreview, setShowSelectedPreview] = useState<boolean>(true);
  const [onlyShowSelected, setOnlyShowSelected] = useState<boolean>(false);

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: SUPPORTED_LANGUAGES.length,
      popular: SUPPORTED_LANGUAGES.filter((l) => l.popular).length,
    };
    for (const lang of SUPPORTED_LANGUAGES) {
      counts[lang.category] = (counts[lang.category] || 0) + 1;
    }
    return counts;
  }, []);

  const categories = [
    { id: 'all', label: 'All', icon: '🌐', count: categoryCounts.all },
    { id: 'popular', label: 'Popular', icon: '⭐', count: categoryCounts.popular },
    { id: 'european', label: 'European', icon: '🇪🇺', count: categoryCounts.european || 0 },
    { id: 'indian', label: 'Indian', icon: '🇮🇳', count: categoryCounts.indian || 0 },
    { id: 'asian', label: 'Asian', icon: '🌏', count: categoryCounts.asian || 0 },
    { id: 'middle-eastern', label: 'Middle East', icon: '🕌', count: categoryCounts['middle-eastern'] || 0 },
    { id: 'african', label: 'African', icon: '🌍', count: categoryCounts.african || 0 },
    { id: 'americas', label: 'Americas', icon: '🌎', count: categoryCounts.americas || 0 },
    { id: 'historical', label: 'Ancient & Historical', icon: '🏛️', count: categoryCounts.historical || 0 },
  ];

  const filteredLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter((lang) => {
      // Filter by selected only toggle
      if (onlyShowSelected && !selectedLanguages.includes(lang.code)) {
        return false;
      }

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matches =
          lang.name.toLowerCase().includes(q) ||
          lang.nativeName.toLowerCase().includes(q) ||
          lang.code.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter (ignored if viewing only selected)
      if (onlyShowSelected) return true;
      if (activeCategory === 'all') return true;
      if (activeCategory === 'popular') return lang.popular;
      return lang.category === activeCategory;
    });
  }, [searchQuery, activeCategory, onlyShowSelected, selectedLanguages]);

  const visibleCodes = useMemo(() => filteredLanguages.map((l) => l.code), [filteredLanguages]);
  const isAllVisibleSelected =
    visibleCodes.length > 0 && visibleCodes.every((code) => selectedLanguages.includes(code));

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

  const removeLanguage = (code: string) => {
    if (selectedLanguages.length <= 1) {
      alert('Please keep at least one target language selected.');
      return;
    }
    onChange(selectedLanguages.filter((l) => l !== code));
  };

  // Select all visible in current tab or search
  const handleSelectVisible = () => {
    const combined = Array.from(new Set([...selectedLanguages, ...visibleCodes]));
    onChange(combined);
  };

  // Deselect all visible in current tab or search
  const handleDeselectVisible = () => {
    const visibleSet = new Set(visibleCodes);
    const remaining = selectedLanguages.filter((c) => !visibleSet.has(c));
    onChange(remaining.length > 0 ? remaining : ['en']);
  };

  // Select entire platform catalog (all 174)
  const handleSelectAllGlobal = () => {
    onChange(SUPPORTED_LANGUAGES.map((l) => l.code));
  };

  // Clear all except English
  const handleClearAll = () => {
    onChange(['en']);
  };

  const handleApplyPreset = (presetLangs: string[]) => {
    onChange(presetLangs);
  };

  const handleResetDefaults = () => {
    onChange(DEFAULT_TARGET_LANGUAGES);
  };

  const activeCategoryLabel =
    categories.find((c) => c.id === activeCategory)?.label || 'Current';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c121e] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                  Select Target Languages
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {selectedLanguages.length} selected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose multiple languages to translate into simultaneously
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Languages Chips Preview Bar */}
        {selectedLanguages.length > 0 && (
          <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
              <button
                type="button"
                onClick={() => setShowSelectedPreview(!showSelectedPreview)}
                className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                <span>Active Selections ({selectedLanguages.length})</span>
                {showSelectedPreview ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyShowSelected(!onlyShowSelected)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    onlyShowSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {onlyShowSelected ? 'Show All Languages' : 'Filter to Selected'}
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-slate-400 hover:text-red-500 text-[11px] font-medium cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {showSelectedPreview && (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedLanguages.map((code) => {
                  const info = getLanguageInfo(code);
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/60 text-slate-800 dark:text-slate-200 text-xs font-medium shadow-xs"
                    >
                      <span>{info?.flag || '🌐'}</span>
                      <span className="truncate max-w-[90px]">{info?.name || code}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(code)}
                        className="p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title={`Remove ${info?.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quick Presets Bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-blue-500" /> Presets:
          </span>
          {LANGUAGE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.languages)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all whitespace-nowrap cursor-pointer hover:border-blue-400 font-medium shadow-xs"
            >
              <span>{preset.icon}</span>
              <span>{preset.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({preset.languages.length})</span>
            </button>
          ))}
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />
          <button
            onClick={handleResetDefaults}
            className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 whitespace-nowrap cursor-pointer text-xs"
            title="Reset to default 6 languages"
          >
            <RotateCcw className="w-3 h-3" /> Defaults
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900/30">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, script (e.g. Føroyskt, Occitan, Español, മലയാളം), or code (e.g. fo, br, oc)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOnlyShowSelected(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id && !onlyShowSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeCategory === cat.id && !onlyShowSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Context Action Bar: Select/Deselect visible & Global */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredLanguages.length}</strong>{' '}
              {onlyShowSelected ? 'selected' : activeCategoryLabel} languages
            </span>

            <div className="flex items-center gap-1.5">
              {isAllVisibleSelected ? (
                <button
                  type="button"
                  onClick={handleDeselectVisible}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors font-semibold cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Deselect {activeCategory !== 'all' ? activeCategoryLabel : 'Visible'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectVisible}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 transition-colors font-semibold cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>
                    Select All {activeCategory !== 'all' ? activeCategoryLabel : 'Visible'} ({visibleCodes.length})
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSelectAllGlobal}
                className="px-2 py-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer"
                title="Select all 174 supported languages"
              >
                All (174)
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-2 py-1 text-slate-400 hover:text-red-500 hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filteredLanguages.map((lang: LanguageInfo) => {
            const isSelected = selectedLanguages.includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-600 text-blue-950 dark:text-blue-100 shadow-xs'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {lang.flag}
                  </span>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate text-slate-900 dark:text-white">
                        {lang.name}
                      </p>
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase shrink-0">
                        {lang.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {lang.nativeName}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'border-slate-300 dark:border-slate-700 group-hover:border-blue-400'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-12 text-center space-y-2">
              <p className="text-slate-400 text-sm">
                No languages found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setOnlyShowSelected(false);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Reset Search and Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
              {selectedLanguages.length}
            </span>{' '}
            of {SUPPORTED_LANGUAGES.length} languages selected
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
