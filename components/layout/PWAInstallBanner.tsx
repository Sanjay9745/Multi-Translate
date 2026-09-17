'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share2, PlusSquare, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // 1. Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
      });
    }

    // 2. Check if already installed / standalone
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isAppStandalone);
    if (isAppStandalone) return;

    // Check if dismissed previously this session
    const hasDismissed = sessionStorage.getItem('multitranslate_pwa_dismissed');
    if (hasDismissed) return;

    // 3. Android / Chromium beforeinstallprompt handler
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3 seconds before displaying prompt to let user interact with app first
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. iOS Safari detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      /safari/.test(userAgent) && !/chrome|crios|fxios|optios/.test(userAgent);

    if (isIosDevice && isSafari && !isAppStandalone) {
      setIsIOS(true);
      setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('multitranslate_pwa_dismissed', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <aside aria-label="Install App" className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-blue-100 dark:border-slate-700/80 ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-tight">
                Install MultiTranslate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Fast multi-language translation on your phone.
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="bg-blue-50/80 dark:bg-blue-950/40 rounded-xl p-3 text-xs text-blue-900 dark:text-blue-200 mb-3 space-y-1.5 border border-blue-100 dark:border-blue-900/50">
            <p className="font-medium">Install on iPhone / iPad:</p>
            <div className="flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                1. Tap the <strong>Share</strong> icon in Safari
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PlusSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                2. Scroll down & select <strong>&quot;Add to Home Screen&quot;</strong>
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Translate languages faster with offline support, instant launch, and full-screen mobile experience.
          </p>
        )}

        <div className="flex items-center gap-2">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}
          <button
            onClick={handleDismiss}
            className={`${
              !isIOS && deferredPrompt ? 'flex-none' : 'flex-1'
            } text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-2.5 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-center cursor-pointer`}
          >
            Not Now
          </button>
        </div>
      </div>
    </aside>
  );
}
