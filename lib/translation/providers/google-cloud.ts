import { TranslationProvider } from '../types';

/**
 * Official Google Cloud Translation API (v2)
 * Used when GOOGLE_TRANSLATE_API_KEY is configured in .env.local
 */
export class GoogleCloudTranslator implements TranslationProvider {
  id = 'google-cloud';
  name = 'Google Cloud Translation';

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_TRANSLATE_API_KEY || '';
  }

  async detectLanguage(text: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured');
    }
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text }),
      }
    );
    if (!res.ok) return 'auto';
    const data = await res.json();
    return data.data?.detections?.[0]?.[0]?.language || 'auto';
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured');
    }
    const body: Record<string, unknown> = {
      q: text,
      target: targetLanguage,
      format: 'text',
    };
    if (sourceLanguage !== 'auto') {
      body.source = sourceLanguage;
    }

    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Google Cloud API error ${res.status}`);
    }

    const data = await res.json();
    return data.data?.translations?.[0]?.translatedText || text;
  }
}
