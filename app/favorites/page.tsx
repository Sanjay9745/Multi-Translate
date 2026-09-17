'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Heart,
  Volume2,
  Copy,
  Check,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useFavorites } from '@/lib/storage/useFavorites';
import { useTTS } from '@/lib/speech/useTTS';

export default function FavoritesPage() {
  const { favorites, isLoaded, removeFavorite } = useFavorites();
  const { speak, playingId } = useTTS();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((fav) => {
      const q = searchQuery.toLowerCase();
      return (
        fav.sourceText.toLowerCase().includes(q) ||
        fav.translatedText.toLowerCase().includes(q) ||
        fav.languageName.toLowerCase().includes(q)
      );
    });
  }, [favorites, searchQuery]);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Saved Favorites
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Starred words, phrases, and sentences for quick reference
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
            {favorites.length} saved
          </span>
        </div>

        {/* Search */}
        {favorites.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search favorites by original text, translation, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
            />
          </div>
        )}

        {/* List */}
        {!isLoaded ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading saved favorites...
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                {searchQuery ? 'No matching favorites found' : 'No favorites saved yet'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try searching for a different phrase.'
                  : 'Tap the heart icon on any translation card to save it to your personal phrasebook.'}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <span>Discover & Translate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFavorites.map((fav) => {
              const isSpeaking = playingId === `fav_${fav.id}`;
              return (
                <div
                  key={fav.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-red-200 dark:hover:border-slate-700 transition-all"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{fav.flag}</span>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {fav.languageName}
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          {new Date(fav.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>

                  {/* Texts */}
                  <div className="space-y-2">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-slate-400">
                        Original
                      </span>
                      <p className="line-clamp-2">&ldquo;{fav.sourceText}&rdquo;</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                        Translation
                      </span>
                      <p>{fav.translatedText}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() =>
                        speak(fav.translatedText, fav.targetLanguage, `fav_${fav.id}`)
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isSpeaking
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'Playing...' : 'Pronounce'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(fav.translatedText, fav.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {copiedId === fav.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
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
