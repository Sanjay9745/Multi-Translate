'use client';

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { PWAInstallBanner } from '@/components/layout/PWAInstallBanner';
import { TranslationInput } from '@/components/translation/TranslationInput';
import { TargetLanguageBar } from '@/components/translation/TargetLanguageBar';
import { ModeSwitcher } from '@/components/translation/ModeSwitcher';
import { QuickTranslateGrid } from '@/components/translation/QuickTranslateGrid';
import { CompareView } from '@/components/translation/CompareView';
import { LearningView } from '@/components/translation/LearningView';
import { useSettings } from '@/lib/storage/useSettings';
import { useHistory } from '@/lib/storage/useHistory';
import {
  TranslationItem,
  TranslationMode,
  TranslationResponse,
} from '@/lib/translation/types';
import { DEFAULT_TARGET_LANGUAGES } from '@/lib/translation/languages.config';

export default function HomePage() {
  const { settings, isLoaded: settingsLoaded } = useSettings();
  const { addHistoryItem } = useHistory();

  const [text, setText] = useState('Buongiorno, come stai?');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguages, setTargetLanguages] = useState<string[]>(DEFAULT_TARGET_LANGUAGES);
  const [mode, setMode] = useState<TranslationMode>('quick');
  const [isLoading, setIsLoading] = useState(false);
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | undefined>('it');
  const [lastTranslatedText, setLastTranslatedText] = useState('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Sync default target languages from user settings once loaded
  useEffect(() => {
    if (settingsLoaded && settings.defaultTargetLanguages?.length > 0) {
      setTargetLanguages(settings.defaultTargetLanguages);
      if (settings.defaultSourceLanguage) {
        setSourceLanguage(settings.defaultSourceLanguage);
      }
    }
  }, [settingsLoaded, settings]);

  const handleTranslate = useCallback(async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setErrorBanner(null);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          sourceLanguage,
          targetLanguages,
          mode,
          provider: settings.preferredProvider,
        }),
      });

      const data: TranslationResponse & { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Translation request failed');
      }

      setTranslations(data.translations || []);
      setDetectedLanguage(data.detectedLanguage);
      setLastTranslatedText(text.trim());

      // Persist to history if enabled
      if (settings.saveHistory && data.translations?.length > 0) {
        const successful = data.translations
          .filter((t) => t.status === 'success')
          .map((t) => ({
            language: t.language,
            languageName: t.languageName,
            flag: t.flag,
            text: t.text,
          }));

        if (successful.length > 0) {
          addHistoryItem({
            sourceText: text.trim(),
            sourceLanguage: data.sourceLanguage || sourceLanguage,
            targetLanguages,
            translations: successful,
          });
        }
      }

      // Quick subtle confetti if 4+ translations finished successfully
      const successCount = (data.translations || []).filter((t) => t.status === 'success').length;
      if (successCount >= 4) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.85 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      }
    } catch (err) {
      console.error('Translation failed:', err);
      setErrorBanner(
        err instanceof Error ? err.message : 'Translation service error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    text,
    sourceLanguage,
    targetLanguages,
    mode,
    settings.preferredProvider,
    settings.saveHistory,
    addHistoryItem,
  ]);

  // Retry an individual target language if it failed
  const handleRetrySingle = async (langCode: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: lastTranslatedText || text,
          sourceLanguage,
          targetLanguages: [langCode],
          mode,
          provider: settings.preferredProvider,
        }),
      });

      const data: TranslationResponse = await res.json();
      if (res.ok && data.translations?.[0]) {
        const updatedItem = data.translations[0];
        setTranslations((prev) =>
          prev.map((item) => (item.language === langCode ? updatedItem : item))
        );
      }
    } catch {
      // ignore
    }
  };

  // Perform initial translation on load so the user sees results immediately
  useEffect(() => {
    handleTranslate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24 md:pb-12">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                OmniTranslate – Simultaneous Multi-Translator
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xs">
                <Sparkles className="w-3 h-3" /> Real-time
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Translate into English, Malayalam, Hindi, Spanish, French, Arabic, and 100+ world languages concurrently.
            </p>
          </div>

          {/* Mode Switcher */}
          <ModeSwitcher mode={mode} onChange={setMode} />
        </div>

        {/* Target Language Selection Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <TargetLanguageBar
            selectedLanguages={targetLanguages}
            onChange={setTargetLanguages}
          />
        </div>

        {/* Translation Input Card */}
        <TranslationInput
          text={text}
          onChange={setText}
          sourceLanguage={sourceLanguage}
          onSourceLanguageChange={setSourceLanguage}
          onTranslate={handleTranslate}
          isLoading={isLoading}
          detectedLanguage={detectedLanguage}
        />

        {/* Error Alert if any */}
        {errorBanner && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-3 text-sm text-red-700 dark:text-red-300 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={handleTranslate}
              className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/60 hover:bg-red-200 text-red-800 dark:text-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Translation Results According to Selected Mode */}
        {mode === 'quick' && (
          <QuickTranslateGrid
            translations={translations}
            sourceText={lastTranslatedText || text}
            sourceLanguage={sourceLanguage}
            isLoading={isLoading}
            targetLanguages={targetLanguages}
            onRetrySingle={handleRetrySingle}
          />
        )}

        {mode === 'compare' && (
          <CompareView
            translations={translations}
            sourceText={lastTranslatedText || text}
            sourceLanguage={sourceLanguage}
          />
        )}

        {mode === 'learning' && (
          <LearningView
            translations={translations}
            sourceText={lastTranslatedText || text}
            sourceLanguage={sourceLanguage}
          />
        )}
      </main>

      {/* PWA Floating Install Banner for Mobile */}
      <PWAInstallBanner />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
