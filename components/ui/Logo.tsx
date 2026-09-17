'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
}

export function Logo({
  className = '',
  size = 'md',
  showText = true,
  subtitle = 'Universal Multi-Language Engine',
}: LogoProps) {
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', svg: 40, text: 'text-lg', sub: 'text-[11px]' },
    lg: { box: 'w-12 h-12', svg: 48, text: 'text-xl', sub: 'text-xs' },
    xl: { box: 'w-16 h-16', svg: 64, text: 'text-2xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Radiant Geometric Prism Icon */}
      <div
        className={`${current.box} relative shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-1.5 shadow-lg shadow-blue-500/20 ring-1 ring-white/20 dark:ring-blue-500/30 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-all duration-300`}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-emerald-500/30 opacity-70 blur-xs" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <defs>
            <linearGradient id="prism-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="prism-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="prism-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="ray-glow" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Central Multi-Faceted Crystal Prism */}
          {/* Top Apex Facet */}
          <polygon
            points="50,15 72,48 50,58 28,48"
            fill="url(#prism-blue)"
            opacity="0.95"
          />
          {/* Left Lower Facet */}
          <polygon
            points="28,48 50,58 50,85 24,62"
            fill="url(#prism-purple)"
            opacity="0.9"
          />
          {/* Right Lower Facet */}
          <polygon
            points="50,58 72,48 76,62 50,85"
            fill="url(#prism-emerald)"
            opacity="0.9"
          />

          {/* Inner Highlight Reflection */}
          <polygon
            points="50,22 66,48 50,54 34,48"
            fill="#ffffff"
            opacity="0.35"
          />

          {/* Emergent Light / Translation Waves */}
          <path
            d="M50 58 Q75 45 92 38"
            stroke="url(#ray-glow)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M50 62 Q78 58 95 55"
            stroke="url(#prism-emerald)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M50 54 Q25 45 8 38"
            stroke="url(#prism-blue)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black ${current.text} tracking-tight text-slate-900 dark:text-white leading-none`}
          >
            Omni<span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Translate</span>
          </span>
          {subtitle && (
            <span
              className={`${current.sub} text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-1 hidden sm:block`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
