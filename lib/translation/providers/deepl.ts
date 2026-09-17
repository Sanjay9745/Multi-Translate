import { TranslationProvider } from '../types';

/**
 * DeepL Translation Provider
 * Used when DEEPL_API_KEY is configured in .env.local
 */
export class DeepLTranslator implements TranslationProvider {
  id = 'deepl';
  name = 'DeepL Translator';

  private apiKey: string;
  private endpoint: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPL_API_KEY || '';
    // Free API keys end with ':fx'
    this.endpoint = this.apiKey.endsWith(':fx')
      ? 'https://api-free.deepl.com/v2/translate'
      : 'https://api.deepl.com/v2/translate';
  }

  async detectLanguage(): Promise<string> {
    return 'auto';
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DEEPL_API_KEY is not configured');
    }

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', targetLanguage.toUpperCase());
    if (sourceLanguage !== 'auto') {
      params.append('source_lang', sourceLanguage.toUpperCase());
    }

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(`DeepL translation failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.translations?.[0]?.text || text;
  }
}
