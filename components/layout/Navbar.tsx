'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe2,
  History,
  Bookmark,
  Languages,
  Settings,
  Sun,
  Moon,
  Laptop,
  Download,
} from 'lucide-react';
import { useSettings } from '@/lib/storage/useSettings';
import { Logo } from '@/components/ui/Logo';

interface NavbarProps {
  onInstallClick?: () => void;
  canInstall?: boolean;
}

export function Navbar({ onInstallClick, canInstall }: NavbarProps) {
  const pathname = usePathname();
  const { settings, updateSettings } = useSettings();

  const navItems = [
    { href: '/', label: 'Translate', icon: Globe2 },
    { href: '/history', label: 'History', icon: History },
    { href: '/favorites', label: 'Favorites', icon: Bookmark },
    { href: '/languages', label: 'Languages', icon: Languages },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const cycleTheme = () => {
    if (settings.theme === 'light') updateSettings({ theme: 'dark' });
    else if (settings.theme === 'dark') updateSettings({ theme: 'system' });
    else updateSettings({ theme: 'light' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group">
          <Logo size="md" subtitle="Simultaneous Multi-Language Engine" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (PWA Install & Theme Switcher) */}
        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:shadow-md cursor-pointer active:scale-95"
              title="Install App as PWA"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle theme"
            title={`Current theme: ${settings.theme} (click to toggle)`}
          >
            {settings.theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : settings.theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
