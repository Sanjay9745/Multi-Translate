'use client';

import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../translation/types';

const STORAGE_KEY = 'multitranslate_history_v1';
const MAX_HISTORY = 100;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load translation history:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveToStorage = useCallback((items: HistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist history:', e);
    }
  }, []);

  const addHistoryItem = useCallback(
    (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
      setHistory((prev) => {
        // Avoid immediate identical duplicates
        const filtered = prev.filter(
          (h) =>
            !(
              h.sourceText.trim().toLowerCase() === item.sourceText.trim().toLowerCase() &&
              h.sourceLanguage === item.sourceLanguage
            )
        );

        const newItem: HistoryItem = {
          ...item,
          id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          timestamp: Date.now(),
        };

        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const deleteHistoryItem = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  }, []);

  return {
    history,
    isLoaded,
    addHistoryItem,
    deleteHistoryItem,
    clearHistory,
  };
}
