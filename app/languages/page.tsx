'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Languages,
  Search,
  Volume2,
  ArrowUpRight,
  Globe2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import {
  SUPPORTED_LANGUAGES,
  LanguageInfo,
} from '@/lib/translation/languages.config';
import { useTTS } from '@/lib/speech/useTTS';

export default function LanguagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { speak, playingId } = useTTS();

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

  const filtered = useMemo(() => {
    return SUPPORTED_LANGUAGES.filter((lang) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'popular') return lang.popular;
      return lang.category === selectedCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleTestTTS = (lang: LanguageInfo) => {
    // Say native greeting or name in its language
    speak(lang.nativeName, lang.code, `dir_${lang.code}`);
  };

  const handleSelectToTranslate = (langCode: string) => {
    router.push(`/?target=${langCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Supported Languages
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore all supported world languages, regional dialects, classical scripts, and voices
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 self-start sm:self-auto">
            {SUPPORTED_LANGUAGES.length} Languages Available
          </span>
        </div>

        {/* Search & Categories */}
        <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by English name, native script (e.g. മലയാളം, हिन्दी, 日本語), or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${selectedCategory === cat.id
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((lang) => {
            const isSpeaking = playingId === `dir_${lang.code}`;
            return (
              <div
                key={lang.code}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-xs hover:border-blue-300 dark:hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-3xl shrink-0">{lang.flag}</span>
                    <div className="truncate">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {lang.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {lang.nativeName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                    {lang.code}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => handleTestTTS(lang)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${isSpeaking
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    title={`Hear native pronunciation for ${lang.name}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Playing...' : 'Voice'}</span>
                  </button>

                  <button
                    onClick={() => handleSelectToTranslate(lang.code)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    <span>Translate</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
