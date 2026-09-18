'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Search,
  Check,
  RotateCcw,
  Sparkles,
  Globe2,
  CheckCheck,
  XCircle,
  ChevronDown,
  Trash2,
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
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isPresetsMenuOpen, setIsPresetsMenuOpen] = useState<boolean>(false);
  const [showChipTray, setShowChipTray] = useState<boolean>(false);

  const presetsMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close presets menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        presetsMenuRef.current &&
        !presetsMenuRef.current.contains(event.target as Node)
      ) {
        setIsPresetsMenuOpen(false);
      }
    }
    if (isPresetsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPresetsMenuOpen]);

  // Handle ESC key to clear search or close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('');
          e.stopPropagation();
        } else if (isPresetsMenuOpen) {
          setIsPresetsMenuOpen(false);
          e.stopPropagation();
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery, isPresetsMenuOpen, onClose]);

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

  const tabs = [
    { id: 'all', label: 'All', icon: '🌐', count: categoryCounts.all },
    {
      id: 'selected',
      label: 'Selected',
      icon: '✓',
      count: selectedLanguages.length,
      highlight: true,
    },
    { id: 'popular', label: 'Popular', icon: '⭐', count: categoryCounts.popular },
    { id: 'european', label: 'European', icon: '🇪🇺', count: categoryCounts.european || 0 },
    { id: 'indian', label: 'Indian', icon: '🇮🇳', count: categoryCounts.indian || 0 },
    { id: 'asian', label: 'Asian', icon: '🌏', count: categoryCounts.asian || 0 },
    { id: 'middle-eastern', label: 'Middle East', icon: '🕌', count: categoryCounts['middle-eastern'] || 0 },
    { id: 'african', label: 'African', icon: '🌍', count: categoryCounts.african || 0 },
    { id: 'americas', label: 'Americas', icon: '🌎', count: categoryCounts.americas || 0 },
    { id: 'historical', label: 'Classical & Ancient', icon: '🏛️', count: categoryCounts.historical || 0 },
  ];

  const filteredLanguages = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter((lang) => {
      // Selected tab filter
      if (activeTab === 'selected') {
        if (!selectedLanguages.includes(lang.code)) return false;
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

      // Tab category filter
      if (activeTab === 'all' || activeTab === 'selected') return true;
      if (activeTab === 'popular') return lang.popular;
      return lang.category === activeTab;
    });
  }, [searchQuery, activeTab, selectedLanguages]);

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
    setIsPresetsMenuOpen(false);
  };

  const handleResetDefaults = () => {
    onChange(DEFAULT_TARGET_LANGUAGES);
  };

  const activeTabInfo = tabs.find((t) => t.id === activeTab);
  const activeTabLabel = activeTabInfo?.label || 'Current';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0c121e] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 flex flex-col max-h-[90vh] overflow-hidden">
        {/* ================================================================= */}
        {/* 1. TOP HEADER: Clean, spacious, with interactive badge & actions */}
        {/* ================================================================= */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-white dark:bg-slate-900/70">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-violet-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/30 shadow-xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">
                  Target Languages
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('selected');
                    setSearchQuery('');
                  }}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                    activeTab === 'selected'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-800/50'
                  }`}
                  title="Click to view only selected languages"
                >
                  <span className="font-bold">{selectedLanguages.length}</span>
                  <span className="opacity-90">selected</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose languages to translate into simultaneously
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Presets Dropdown */}
            <div className="relative" ref={presetsMenuRef}>
              <button
                id="presets-menu-trigger-btn"
                type="button"
                onClick={() => setIsPresetsMenuOpen(!isPresetsMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isPresetsMenuOpen
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Presets</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isPresetsMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Presets Popover Menu */}
              {isPresetsMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span>Curated Bundles</span>
                    <span className="text-[10px] lowercase font-normal">1-click apply</span>
                  </div>
                  <div className="space-y-0.5 max-h-60 overflow-y-auto pr-0.5">
                    {LANGUAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset.languages)}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{preset.icon}</span>
                          <span className="font-medium group-hover:font-semibold">{preset.name}</span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500">
                          {preset.languages.length}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1.5 pt-1.5 flex items-center justify-between px-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleResetDefaults();
                        setIsPresetsMenuOpen(false);
                      }}
                      className="text-[11px] text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectAllGlobal();
                        setIsPresetsMenuOpen(false);
                      }}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold"
                    >
                      Select All (174)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. SEARCH & INTEGRATED CATEGORY TABS (One unified control deck)   */}
        {/* ================================================================= */}
        <div className="px-6 pt-4 pb-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="language-search-input"
              ref={searchInputRef}
              type="text"
              placeholder="Search by name (e.g. Spanish), native script (e.g. മലയാളം, 日本語), or code (es, ml)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 text-sm rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 select-none hidden sm:inline-block">
                ESC
              </span>
            )}
          </div>

          {/* Clean Segmented Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isSelectedTab = tab.id === 'selected';

              return (
                <button
                  id={`tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? isSelectedTab
                        ? 'bg-blue-600 text-white shadow-xs font-semibold'
                        : 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs font-semibold'
                      : isSelectedTab
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/70 dark:border-blue-800/60 font-semibold'
                      : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/70'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? isSelectedTab
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-700 text-white dark:bg-blue-700'
                        : isSelectedTab
                        ? 'bg-blue-200/70 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Context Action Bar: Refined, minimal, zero bloat */}
          <div className="flex items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{filteredLanguages.length}</strong>{' '}
                {activeTab === 'selected' ? 'selected' : activeTabLabel} languages
              </span>

              {/* Optional Chip Tray Quick Toggle for fast inspection without leaving category */}
              {selectedLanguages.length > 0 && activeTab !== 'selected' && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <button
                    type="button"
                    onClick={() => setShowChipTray(!showChipTray)}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    {showChipTray ? 'Hide tags tray' : `View tags (${selectedLanguages.length})`}
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Batch Action for Visible Languages */}
              {visibleCodes.length > 0 && (
                <>
                  {isAllVisibleSelected ? (
                    <button
                      type="button"
                      onClick={handleDeselectVisible}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 font-medium transition-colors cursor-pointer border border-red-200/60 dark:border-red-800/40 text-[11px]"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>
                        Deselect {activeTab !== 'all' && activeTab !== 'selected' ? activeTabLabel : 'Visible'}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSelectVisible}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold transition-colors cursor-pointer border border-blue-200/60 dark:border-blue-800/40 text-[11px]"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>
                        Select All {activeTab !== 'all' && activeTab !== 'selected' ? activeTabLabel : 'Visible'} ({visibleCodes.length})
                      </span>
                    </button>
                  )}
                </>
              )}

              {/* Clear All action when in Selected tab */}
              {activeTab === 'selected' && selectedLanguages.length > 1 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors cursor-pointer text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* Optional Collapsible Selected Chip Tray (Sleek & non-intrusive)   */}
          {/* ================================================================= */}
          {showChipTray && activeTab !== 'selected' && (
            <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Active Selections ({selectedLanguages.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('selected')}
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    View in Grid
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedLanguages.map((code) => {
                  const info = getLanguageInfo(code);
                  return (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
                    >
                      <span>{info?.flag || '🌐'}</span>
                      <span className="truncate max-w-[80px]">{info?.name || code}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(code)}
                        className="p-0.5 rounded text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title={`Remove ${info?.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 3. LANGUAGE CARDS GRID: Spacious, modern, beautiful               */}
        {/* ================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredLanguages.map((lang: LanguageInfo) => {
            const isSelected = selectedLanguages.includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer group select-none ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-500/80 dark:border-blue-500/60 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900/80 border-slate-200/90 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Styled Squircle Flag Badge */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                    {lang.flag}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm truncate text-slate-900 dark:text-white">
                        {lang.name}
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold shrink-0">
                        {lang.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
                      {lang.nativeName}
                    </p>
                  </div>
                </div>

                {/* Animated Checkbox Indicator */}
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ml-2 transition-all duration-150 ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-xs shadow-blue-500/30'
                      : 'border-slate-300 dark:border-slate-700 group-hover:border-blue-400 dark:group-hover:border-blue-500'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">
                No languages found matching &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                Reset Search and Filters
              </button>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 4. FOOTER: Status counter, reset, and action buttons             */}
        {/* ================================================================= */}
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                {selectedLanguages.length}
              </span>{' '}
              of {SUPPORTED_LANGUAGES.length} selected
            </div>

            {/* Quick avatar stack of first few selected */}
            <div className="hidden md:flex items-center -space-x-1.5 overflow-hidden">
              {selectedLanguages.slice(0, 5).map((code) => {
                const info = getLanguageInfo(code);
                return (
                  <div
                    key={code}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-850 text-xs shadow-2xs"
                    title={info?.name}
                  >
                    {info?.flag || '🌐'}
                  </div>
                );
              })}
              {selectedLanguages.length > 5 && (
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-850 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  +{selectedLanguages.length - 5}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium px-2.5 py-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              title="Reset to default 6 languages"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>

            <button
              id="apply-language-selection-btn"
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all cursor-pointer"
            >
              Apply Selection ({selectedLanguages.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
