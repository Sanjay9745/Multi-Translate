# 🌍 MultiTranslate – Production-Ready Multi-Language Translator PWA

MultiTranslate is a modern, high-performance web application and installable Progressive Web App (PWA) built with **Next.js 15+ (App Router)**, **TypeScript**, and **Tailwind CSS**.

Translate words, sentences, and paragraphs into **multiple languages simultaneously** in real-time with zero-delay parallel execution.

---

## ✨ Features

- **Simultaneous Multi-Language Translation**: Translate source text into 1 to 30+ target languages concurrently.
- **60+ Fully Supported Languages**: Comprehensive registry including English, Malayalam, Hindi, Tamil, Telugu, Kannada, Bengali, Gujarati, Punjabi, Marathi, Urdu, Spanish, French, German, Arabic, Japanese, Chinese, and more.
- **3 Translation Modes**:
  - **Quick Translate**: Responsive card grid with instant copy, audio pronunciation, and favorites.
  - **Compare Mode**: Side-by-side comparative layout pairing source text against each target translation.
  - **Learning Mode**: Educational breakdown with phonetic romanization/transliteration, pronunciation guides, grammar nuances, and real-world example sentences.
- **Multi-Modal Input**:
  - Keyboard textarea with character counter (up to 5,000 chars)
  - Voice Speech-to-Text input via Web Speech API
  - Image OCR upload & document scanner via camera/file
  - One-click sample prompt chips
- **Text-to-Speech (TTS)**: Web Speech API synthesis with BCP-47 locale matching and audio wave visualizer.
- **Progressive Web App (PWA)**:
  - Installable on Android & iOS devices
  - Offline Service Worker caching
  - Web App Manifest with standalone display mode
  - Smart install banners for Android and iOS Safari
- **Provider Abstraction Architecture**:
  - `MyMemoryTranslator` (high-speed zero-config default)
  - `GoogleFreeTranslator` (Google GTX web endpoint)
  - `GoogleCloudTranslator` (`GOOGLE_TRANSLATE_API_KEY`)
  - `DeepLTranslator` (`DEEPL_API_KEY`)
  - `LibreTranslator` (`LIBRETRANSLATE_URL`)
  - `AITranslator` (`GEMINI_API_KEY` or `OPENAI_API_KEY`)
- **History & Favorites**: Searchable local translation history with JSON export, and starred favorites.
- **Dark Mode**: High-contrast, elegant light and dark themes with system preference sync.
- **Mobile First Design**: Dedicated mobile bottom navigation bar and touch-friendly controls.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Audio & Speech**: Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **PWA**: Web App Manifest & Service Worker

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
The app works **immediately out of the box with zero API keys required**. To configure optional third-party or enterprise providers, copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Available environment variables:
```env
TRANSLATION_PROVIDER=mymemory
GOOGLE_TRANSLATE_API_KEY=
DEEPL_API_KEY=
GEMINI_API_KEY=
OPENAI_API_KEY=
LIBRETRANSLATE_URL=https://libretranslate.com
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
├── app/
│   ├── page.tsx               # Homepage with Translation Engine
│   ├── history/page.tsx       # Translation History
│   ├── favorites/page.tsx     # Starred Favorites Library
│   ├── languages/page.tsx     # 60+ Languages Directory & Audio Tester
│   ├── settings/page.tsx      # User Preferences & Provider Config
│   ├── api/
│   │   ├── translate/route.ts       # POST /api/translate endpoint
│   │   ├── detect-language/route.ts # POST /api/detect-language
│   │   └── ocr/route.ts             # POST /api/ocr image extractor
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── PWAInstallBanner.tsx
│   └── translation/
│       ├── TranslationInput.tsx
│       ├── TargetLanguageBar.tsx
│       ├── LanguageSelectorModal.tsx
│       ├── TranslationCard.tsx
│       ├── QuickTranslateGrid.tsx
│       ├── CompareView.tsx
│       ├── LearningView.tsx
│       ├── ModeSwitcher.tsx
│       └── ImageOCRModal.tsx
├── lib/
│   ├── translation/
│   │   ├── types.ts
│   │   ├── languages.config.ts # Dynamic registry of all 60+ languages
│   │   ├── service.ts          # Translation orchestrator & batch engine
│   │   └── providers/          # Modular translation providers
│   ├── speech/                 # useTTS and useSTT Web Speech hooks
│   └── storage/                # useHistory, useFavorites, useSettings
└── public/
    ├── manifest.json           # Web App Manifest
    ├── sw.js                   # PWA Service Worker
    └── icons/                  # 192x192, 512x512, maskable icons
```

---

## 📱 Mobile PWA Installation

- **Android (Chrome/Edge)**: Open website &rarr; tap the **"Install App"** prompt &rarr; launch standalone app from Home Screen.
- **iOS (Safari)**: Open website &rarr; tap **Share** button &rarr; tap **"Add to Home Screen"**.
