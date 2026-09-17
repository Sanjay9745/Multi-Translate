import { TranslationProvider } from '../types';

/**
 * LibreTranslate Provider
 * Supports self-hosted or public LibreTranslate instances.
 */
export class LibreTranslator implements TranslationProvider {
  id = 'libre';
  name = 'LibreTranslate';

  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
    this.apiKey = apiKey || process.env.LIBRETRANSLATE_API_KEY || '';
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          api_key: this.apiKey || undefined,
        }),
      });
      if (!res.ok) return 'auto';
      const data = await res.json();
      return data[0]?.language || 'auto';
    } catch {
      return 'auto';
    }
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
        target: targetLanguage,
        format: 'text',
        api_key: this.apiKey || undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(`LibreTranslate request failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.translatedText || text;
  }
}
