export type TranslationMode = 'quick' | 'compare' | 'learning';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguages: string[];
  mode?: TranslationMode;
  provider?: string;
}

export interface LearningDetails {
  transliteration?: string;
  pronunciation?: string;
  literalMeaning?: string;
  exampleSentence?: {
    source: string;
    target: string;
  };
}

export interface TranslationItem {
  language: string;
  languageName: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  text: string;
  learning?: LearningDetails;
  status: 'success' | 'error';
  error?: string;
  provider?: string;
}

export interface TranslationResponse {
  sourceLanguage: string;
  sourceLanguageName?: string;
  translations: TranslationItem[];
  detectedLanguage?: string;
}

export interface TranslationProvider {
  id: string;
  name: string;
  detectLanguage(text: string): Promise<string>;
  translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string>;
  batchTranslate?(text: string, sourceLanguage: string, targetLanguages: string[]): Promise<Record<string, string>>;
  getLearningData?(text: string, sourceLanguage: string, targetLanguage: string, translatedText: string): Promise<LearningDetails>;
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguages: string[];
  translations: {
    language: string;
    languageName: string;
    flag: string;
    text: string;
  }[];
  timestamp: number;
}

export interface FavoriteItem {
  id: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  languageName: string;
  flag: string;
  translatedText: string;
  timestamp: number;
  tags?: string[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultSourceLanguage: string;
  defaultTargetLanguages: string[];
  preferredProvider: string;
  ttsSpeed: number; // 0.8, 1.0, 1.2
  saveHistory: boolean;
  autoTranslateOnPaste: boolean;
}
