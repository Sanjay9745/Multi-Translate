'use client';

import React from 'react';
import { LayoutGrid, Columns, GraduationCap } from 'lucide-react';
import { TranslationMode } from '@/lib/translation/types';

interface ModeSwitcherProps {
  mode: TranslationMode;
  onChange: (mode: TranslationMode) => void;
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  const modes: { id: TranslationMode; label: string; icon: React.ElementType }[] = [
    { id: 'quick', label: 'Quick Translate', icon: LayoutGrid },
    { id: 'compare', label: 'Compare', icon: Columns },
    { id: 'learning', label: 'Learning Mode', icon: GraduationCap },
  ];

  return (
    <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 max-w-fit">
      {modes.map((item) => {
        const Icon = item.icon;
        const isActive = mode === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
