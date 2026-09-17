'use client';

import { useState, useEffect, useCallback } from 'react';
import { FavoriteItem } from '../translation/types';

const STORAGE_KEY = 'multitranslate_favorites_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveToStorage = useCallback((items: FavoriteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist favorites:', e);
    }
  }, []);

  const isFavorite = useCallback(
    (sourceText: string, targetLang: string) => {
      return favorites.some(
        (f) =>
          f.sourceText.trim().toLowerCase() === sourceText.trim().toLowerCase() &&
          f.targetLanguage === targetLang
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, 'id' | 'timestamp'>) => {
      setFavorites((prev) => {
        const existingIndex = prev.findIndex(
          (f) =>
            f.sourceText.trim().toLowerCase() === item.sourceText.trim().toLowerCase() &&
            f.targetLanguage === item.targetLanguage
        );

        let updated: FavoriteItem[];
        if (existingIndex >= 0) {
          updated = prev.filter((_, idx) => idx !== existingIndex);
        } else {
          const newItem: FavoriteItem = {
            ...item,
            id: `fav_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            timestamp: Date.now(),
          };
          updated = [newItem, ...prev];
        }

        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      setFavorites((prev) => {
        const updated = prev.filter((f) => f.id !== id);
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  return {
    favorites,
    isLoaded,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
}
