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
  Key,
  Eye,
  EyeOff,
  Save,
  ExternalLink,
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
  const [toastMessage, setToastMessage] = useState('Settings updated successfully');

  const [apiKeysInput, setApiKeysInput] = useState({
    gemini: '',
    openai: '',
    deepl: '',
    googleCloud: '',
    libreTranslateUrl: '',
    libreTranslateKey: '',
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (settings.apiKeys) {
      setApiKeysInput({
        gemini: settings.apiKeys.gemini || '',
        openai: settings.apiKeys.openai || '',
        deepl: settings.apiKeys.deepl || '',
        googleCloud: settings.apiKeys.googleCloud || '',
        libreTranslateUrl: settings.apiKeys.libreTranslateUrl || '',
        libreTranslateKey: settings.apiKeys.libreTranslateKey || '',
      });
    }
  }, [settings.apiKeys]);

  const triggerToast = (msg?: string) => {
    if (msg) setToastMessage(msg);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      apiKeys: {
        gemini: apiKeysInput.gemini.trim() || undefined,
        openai: apiKeysInput.openai.trim() || undefined,
        deepl: apiKeysInput.deepl.trim() || undefined,
        googleCloud: apiKeysInput.googleCloud.trim() || undefined,
        libreTranslateUrl: apiKeysInput.libreTranslateUrl.trim() || undefined,
        libreTranslateKey: apiKeysInput.libreTranslateKey.trim() || undefined,
      },
    });
    triggerToast('API Keys saved successfully! Engines will now use your credentials.');
  };

  const handleClearKey = (field: keyof typeof apiKeysInput) => {
    const updated = { ...apiKeysInput, [field]: '' };
    setApiKeysInput(updated);
    updateSettings({
      apiKeys: {
        ...settings.apiKeys,
        [field]: undefined,
      },
    });
    triggerToast(`Cleared custom key for ${field}`);
  };

  const toggleShowKey = (field: string) => {
    setShowKeys((prev) => ({ ...prev, [field]: !prev[field] }));
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

        {/* 4.1 Custom API Keys Configuration */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <div>
                <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Custom API Keys & Credentials
                </h2>
                <p className="text-[11px] text-slate-400">
                  Override default server environment variables with your personal API keys
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Stored in LocalStorage
            </span>
          </div>

          <form onSubmit={handleSaveApiKeys} className="space-y-4">
            {/* Google Gemini Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>Google Gemini API Key</span>
                  <span className="text-[10px] font-normal text-slate-400">(For AI Translator & Learning Mode)</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showKeys.gemini ? 'text' : 'password'}
                  value={apiKeysInput.gemini}
                  onChange={(e) => setApiKeysInput({ ...apiKeysInput, gemini: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-20 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleShowKey('gemini')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showKeys.gemini ? 'Hide key' : 'Show key'}
                  >
                    {showKeys.gemini ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKeysInput.gemini && (
                    <button
                      type="button"
                      onClick={() => handleClearKey('gemini')}
                      className="text-[10px] text-red-500 hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* OpenAI Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>OpenAI API Key</span>
                  <span className="text-[10px] font-normal text-slate-400">(Alternative for AI Translator)</span>
                </label>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>OpenAI Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showKeys.openai ? 'text' : 'password'}
                  value={apiKeysInput.openai}
                  onChange={(e) => setApiKeysInput({ ...apiKeysInput, openai: e.target.value })}
                  placeholder="sk-..."
                  className="w-full pl-3 pr-20 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleShowKey('openai')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showKeys.openai ? 'Hide key' : 'Show key'}
                  >
                    {showKeys.openai ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKeysInput.openai && (
                    <button
                      type="button"
                      onClick={() => handleClearKey('openai')}
                      className="text-[10px] text-red-500 hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* DeepL Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>DeepL API Key</span>
                  <span className="text-[10px] font-normal text-slate-400">(Supports free :fx or pro keys)</span>
                </label>
                <a
                  href="https://www.deepl.com/pro-api"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>DeepL Account</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showKeys.deepl ? 'text' : 'password'}
                  value={apiKeysInput.deepl}
                  onChange={(e) => setApiKeysInput({ ...apiKeysInput, deepl: e.target.value })}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx"
                  className="w-full pl-3 pr-20 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleShowKey('deepl')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showKeys.deepl ? 'Hide key' : 'Show key'}
                  >
                    {showKeys.deepl ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKeysInput.deepl && (
                    <button
                      type="button"
                      onClick={() => handleClearKey('deepl')}
                      className="text-[10px] text-red-500 hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Google Cloud Translate API Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Google Cloud Translation API v2 Key
                </label>
                <a
                  href="https://cloud.google.com/translate"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>GCP Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showKeys.googleCloud ? 'text' : 'password'}
                  value={apiKeysInput.googleCloud}
                  onChange={(e) => setApiKeysInput({ ...apiKeysInput, googleCloud: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-20 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleShowKey('googleCloud')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showKeys.googleCloud ? 'Hide key' : 'Show key'}
                  >
                    {showKeys.googleCloud ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKeysInput.googleCloud && (
                    <button
                      type="button"
                      onClick={() => handleClearKey('googleCloud')}
                      className="text-[10px] text-red-500 hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* LibreTranslate Host URL & Key */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  LibreTranslate URL
                </label>
                <input
                  type="text"
                  value={apiKeysInput.libreTranslateUrl}
                  onChange={(e) => setApiKeysInput({ ...apiKeysInput, libreTranslateUrl: e.target.value })}
                  placeholder="https://libretranslate.com"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  LibreTranslate API Key (Optional)
                </label>
                <input
                  type={showKeys.libreTranslateKey ? 'text' : 'password'}
                  value={apiKeysInput.libreTranslateKey}
                  onChange={(e) => setApiKeysInput({ ...apiKeysInput, libreTranslateKey: e.target.value })}
                  placeholder="Optional API key..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Leave inputs blank to use default public endpoints or server environment variables.
              </p>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save API Credentials</span>
              </button>
            </div>
          </form>
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
            <span>{toastMessage}</span>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
