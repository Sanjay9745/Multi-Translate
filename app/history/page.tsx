'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  Trash2,
  ExternalLink,
  Search,
  Calendar,
  Layers,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useHistory } from '@/lib/storage/useHistory';
import { getLanguageInfo } from '@/lib/translation/languages.config';

export default function HistoryPage() {
  const router = useRouter();
  const { history, isLoaded, deleteHistoryItem, clearHistory } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSource = item.sourceText.toLowerCase().includes(q);
      const matchTarget = item.translations.some((t) =>
        t.text.toLowerCase().includes(q) || t.languageName.toLowerCase().includes(q)
      );
      return matchSource || matchTarget;
    });
  }, [history, searchQuery]);

  const handleOpenItem = (item: (typeof history)[0]) => {
    // Navigate to homepage with query param or store in sessionStorage
    sessionStorage.setItem('multitranslate_reuse_text', item.sourceText);
    sessionStorage.setItem('multitranslate_reuse_src', item.sourceLanguage);
    router.push('/');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `multitranslate_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Translation History
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review, reuse, or manage your recent multi-language translations
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                title="Export history as JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all translation history?')) {
                    clearHistory();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search translation history by original text or translated words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        )}

        {/* History List */}
        {!isLoaded ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading your translation history...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                {searchQuery ? 'No matching history found' : 'No translation history yet'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try searching with another keyword.'
                  : 'Translations you perform will be stored securely on your device for fast review.'}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <span>Start Translating</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const srcInfo = getLanguageInfo(item.sourceLanguage);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3.5 shadow-xs hover:border-blue-200 dark:hover:border-slate-700 transition-all group"
                >
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {srcInfo?.flag} {srcInfo?.name || item.sourceLanguage}
                      </span>
                      <span>&rarr;</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {item.translations.length} languages
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatTimestamp(item.timestamp)}
                      </span>

                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Source Text */}
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                    &ldquo;{item.sourceText}&rdquo;
                  </p>

                  {/* Sample Target Translations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {item.translations.map((t) => (
                      <div
                        key={t.language}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
                          <span>{t.flag}</span>
                          <span>{t.languageName}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 line-clamp-2">
                          {t.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Open in Translator action */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleOpenItem(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      <span>Open in MultiTranslate</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
