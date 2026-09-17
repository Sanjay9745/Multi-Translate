'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserSettings } from '../translation/types';
import { DEFAULT_TARGET_LANGUAGES } from '../translation/languages.config';

const SETTINGS_KEY = 'multitranslate_settings_v1';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  defaultSourceLanguage: 'auto',
  defaultTargetLanguages: DEFAULT_TARGET_LANGUAGES,
  preferredProvider: 'google-free',
  ttsSpeed: 1.0,
  saveHistory: true,
  autoTranslateOnPaste: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Apply theme to document root
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        applyTheme(merged.theme);
      } else {
        applyTheme('system');
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setIsLoaded(true);
    }

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const current = localStorage.getItem(SETTINGS_KEY);
      if (!current || JSON.parse(current).theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist settings:', e);
      }
      if (updates.theme) {
        applyTheme(updates.theme);
      }
      return updated;
    });
  }, []);

  return {
    settings,
    isLoaded,
    updateSettings,
  };
}
