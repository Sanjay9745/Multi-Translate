'use client';

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Globe2,
  Volume2,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  Cpu,
  User,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useSettings } from '@/lib/storage/useSettings';
import { useHistory } from '@/lib/storage/useHistory';
import { useFavorites } from '@/lib/storage/useFavorites';
import {
  SUPPORTED_LANGUAGES,
  AUTO_DETECT_LANGUAGE,
  DEFAULT_TARGET_LANGUAGES,
} from '@/lib/translation/languages.config';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { clearHistory, history } = useHistory();
  const { favorites } = useFavorites();
  const [userProfile, setUserProfile] = useState<{ email: string; name: string } | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleToggleTargetLang = (code: string) => {
    const current = settings.defaultTargetLanguages || [];
    let updated: string[];
    if (current.includes(code)) {
      if (current.length <= 1) return;
      updated = current.filter((c) => c !== code);
    } else {
      updated = [...current, code];
    }
    updateSettings({ defaultTargetLanguages: updated });
    triggerToast();
  };

  const handleGoogleDemoSignIn = () => {
    if (userProfile) {
      setUserProfile(null);
    } else {
      setUserProfile({
        name: 'Demo User',
        email: 'user@multitranslate.app',
      });
    }
  };

  const providers = [
    {
      id: 'google-free',
      name: 'Google Translate (Standard)',
      desc: 'High speed, zero-configuration required, 100+ languages',
      status: 'Active / Recommended',
    },
    {
      id: 'ai',
      name: 'AI Contextual Translator',
      desc: 'Idiom-aware, tone preservation, learning breakdown (Gemini/OpenAI)',
      status: 'Available',
    },
    {
      id: 'mymemory',
      name: 'MyMemory Translated.net',
      desc: 'Crowdsourced translation memory fallback engine',
      status: 'Available',
    },
    {
      id: 'google-cloud',
      name: 'Google Cloud API (v2)',
      desc: 'Official enterprise translation API (requires GOOGLE_TRANSLATE_API_KEY)',
      status: 'Configurable',
    },
    {
      id: 'deepl',
      name: 'DeepL Translation',
      desc: 'European & Asian neural machine translation (requires DEEPL_API_KEY)',
      status: 'Configurable',
    },
    {
      id: 'libre',
      name: 'LibreTranslate (Open-Source)',
      desc: 'Self-hosted or public instances (requires LIBRETRANSLATE_URL)',
      status: 'Configurable',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-24 md:pb-12">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Application Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize appearance, default languages, translation engines, and speech
            </p>
          </div>
        </div>

        {/* 1. Account & Synchronization */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Account & Cloud Sync
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {userProfile ? userProfile.name : 'Guest User (Offline Local Mode)'}
              </p>
              <p className="text-xs text-slate-400">
                {userProfile
                  ? `Signed in as ${userProfile.email}. Settings and history are synchronized.`
                  : 'Translations, history, and favorites are stored locally on your device.'}
              </p>
            </div>

            <button
              onClick={handleGoogleDemoSignIn}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                userProfile
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{userProfile ? 'Sign Out' : 'Sign In with Google'}</span>
            </button>
          </div>
        </section>

        {/* 2. Appearance & Theme */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sun className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Appearance
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = settings.theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => {
                    updateSettings({ theme: th.id as 'light' | 'dark' | 'system' });
                    triggerToast();
                  }}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{th.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Default Languages */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Globe2 className="w-4 h-4 text-emerald-500" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Default Languages
            </h2>
          </div>

          <div className="space-y-4">
            {/* Default Source */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Default Source Language
              </label>
              <select
                value={settings.defaultSourceLanguage}
                onChange={(e) => {
                  updateSettings({ defaultSourceLanguage: e.target.value });
                  triggerToast();
                }}
                className="w-full sm:w-64 p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="auto">✨ Auto Detect</option>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Default Target Languages */}
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Default Target Languages (preloaded on launch)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                {SUPPORTED_LANGUAGES.map((l) => {
                  const isChecked = settings.defaultTargetLanguages?.includes(l.code);
                  return (
                    <button
                      key={l.code}
                      onClick={() => handleToggleTargetLang(l.code)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Translation Provider Selection */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Cpu className="w-4 h-4 text-purple-500" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Translation Engine Provider
            </h2>
          </div>

          <div className="space-y-2.5">
            {providers.map((p) => {
              const isSelected = (settings.preferredProvider || 'google-free') === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    updateSettings({ preferredProvider: p.id });
                    triggerToast();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-500 text-purple-950 dark:text-purple-100 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {p.name}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.2 rounded-full ${
                          p.status.includes('Active')
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</p>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Speech & Audio Controls */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Text-to-Speech & Voice
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Audio Playback Speed
                </p>
                <p className="text-[11px] text-slate-400">
                  Control the rate for native pronunciations
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                {[0.8, 1.0, 1.2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      updateSettings({ ttsSpeed: rate });
                      triggerToast();
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      settings.ttsSpeed === rate
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. History & Data Management */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Privacy & Local Storage
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Save Translation History
                </p>
                <p className="text-[11px] text-slate-400">
                  Automatically save queries to local history
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.saveHistory}
                onChange={(e) => {
                  updateSettings({ saveHistory: e.target.checked });
                  triggerToast();
                }}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">
                {history.length} history items &bull; {favorites.length} favorites
              </span>

              <button
                onClick={() => {
                  if (confirm('Clear local history and cache?')) {
                    clearHistory();
                    triggerToast();
                  }
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cache</span>
              </button>
            </div>
          </div>
        </section>

        {/* Toast confirmation */}
        {saveToast && (
          <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings updated successfully</span>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
