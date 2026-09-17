'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  X,
  Clipboard,
  Mic,
  Camera,
  ArrowRight,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  AUTO_DETECT_LANGUAGE,
  getLanguageInfo,
  LanguageInfo,
} from '@/lib/translation/languages.config';
import { useSTT } from '@/lib/speech/useSTT';
import { ImageOCRModal } from './ImageOCRModal';

interface TranslationInputProps {
  text: string;
  onChange: (text: string) => void;
  sourceLanguage: string;
  onSourceLanguageChange: (lang: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  detectedLanguage?: string;
}

const MAX_CHAR_LIMIT = 5000;

const SAMPLE_PHRASES = [
  { text: 'Buongiorno, come stai?', label: 'Italian 🇮🇹' },
  { text: 'Hello, welcome to MultiTranslate! How can I help you today?', label: 'English 🇬🇧' },
  { text: 'സുപ്രഭാതം, ഇന്നത്തെ ദിവസം എങ്ങനെയുണ്ട്?', label: 'Malayalam 🇮🇳' },
  { text: 'आप कैसे हैं? क्या आप अंग्रेजी बोलते हैं?', label: 'Hindi 🇮🇳' },
  { text: 'Bonjour tout le monde! Bon voyage!', label: 'French 🇫🇷' },
];

export function TranslationInput({
  text,
  onChange,
  sourceLanguage,
  onSourceLanguageChange,
  onTranslate,
  isLoading,
  detectedLanguage,
}: TranslationInputProps) {
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  // Speech to Text hook
  const { isListening, startListening, stopListening } = useSTT((transcript) => {
    onChange(text ? `${text} ${transcript}` : transcript);
  });

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        onChange(text ? `${text} ${clipboardText}` : clipboardText);
      }
    } catch {
      alert('Clipboard access was denied. Please paste manually.');
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text.trim() && !isLoading) {
        onTranslate();
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lang-selector-container')) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const currentSourceInfo =
    sourceLanguage === 'auto'
      ? AUTO_DETECT_LANGUAGE
      : getLanguageInfo(sourceLanguage) || AUTO_DETECT_LANGUAGE;

  const detectedInfo = detectedLanguage ? getLanguageInfo(detectedLanguage) : null;

  const filteredSourceLangs = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800 transition-all">
      {/* Top Bar: Source Language & Tools */}
      <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        {/* Source Language Selector */}
        <div className="relative lang-selector-container">
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <span>{currentSourceInfo.flag}</span>
            <span>{currentSourceInfo.name}</span>
            {detectedInfo && sourceLanguage === 'auto' && (
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                ({detectedInfo.name})
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
          </button>

          {/* Source Language Dropdown */}
          {isLangDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 max-h-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                <input
                  type="text"
                  placeholder="Search source language..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="overflow-y-auto flex-1 p-1">
                {/* Auto Detect Option */}
                <button
                  onClick={() => {
                    onSourceLanguageChange('auto');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                    sourceLanguage === 'auto'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    <span>Auto Detect</span>
                  </div>
                </button>

                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1" />

                {filteredSourceLangs.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSourceLanguageChange(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                      sourceLanguage === lang.code
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                      {lang.nativeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
          {/* Paste */}
          <button
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {/* Voice Input */}
          <button
            onClick={() => (isListening ? stopListening() : startListening(sourceLanguage))}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input (Speak to translate)'}
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isListening ? 'Listening...' : 'Voice'}
            </span>
          </button>

          {/* Image OCR */}
          <button
            onClick={() => setIsOcrOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Upload image / document to extract text"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Image</span>
          </button>

          {/* Clear */}
          {text && (
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative p-4">
        <textarea
          rows={4}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter word, sentence, paragraph or short text to translate simultaneously..."
          maxLength={MAX_CHAR_LIMIT}
          className="w-full bg-transparent resize-y min-h-[120px] text-slate-900 dark:text-slate-100 placeholder-slate-400 text-base sm:text-lg focus:outline-none leading-relaxed"
        />

        {/* Character Count & Shortcuts Hint */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-400">
          <span className="hidden sm:inline text-slate-400/80">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] border border-slate-200 dark:border-slate-700">Enter</kbd> to translate
          </span>
          <span
            className={`ml-auto font-mono text-xs ${
              text.length > MAX_CHAR_LIMIT * 0.9
                ? 'text-amber-500 font-semibold'
                : 'text-slate-400'
            }`}
          >
            {text.length.toLocaleString()} / {MAX_CHAR_LIMIT.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Empty State Sample Prompts */}
      {!text && (
        <div className="px-4 pb-3 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-500" /> Try:
          </span>
          {SAMPLE_PHRASES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onChange(sample.text)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Action Footer with Sticky Primary Translate Button */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/40 rounded-b-2xl border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5">
          <span>Target engine: High-throughput batch translator</span>
        </div>

        <button
          onClick={onTranslate}
          disabled={isLoading || !text.trim()}
          className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating into all languages...</span>
            </>
          ) : (
            <>
              <span>🌍 Translate Simultaneously</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <ImageOCRModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onTextExtracted={(extracted) => onChange(extracted)}
      />
    </div>
  );
}
