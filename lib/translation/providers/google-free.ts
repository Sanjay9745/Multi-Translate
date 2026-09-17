import { TranslationProvider, LearningDetails } from '../types';

/**
 * Google Free Translation Provider
 * Uses Google's web translation client endpoint (no API key required).
 * Fast, reliable, supports 100+ languages and extracts romanization/transliteration.
 */
export class GoogleFreeTranslator implements TranslationProvider {
  id = 'google-free';
  name = 'Google Translate (Standard)';

  async detectLanguage(text: string): Promise<string> {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        text.slice(0, 500)
      )}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        cache: 'no-store',
      });
      if (!res.ok) return 'auto';
      const data = await res.json();
      // Google returns detected language at index 2 or 8
      if (typeof data[2] === 'string') {
        return data[2];
      }
      return 'auto';
    } catch {
      return 'auto';
    }
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    const sl = sourceLanguage === 'auto' ? 'auto' : sourceLanguage;
    const tl = targetLanguage;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=rm&q=${encodeURIComponent(
      text
    )}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Google translate request failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data[0])) {
      throw new Error('Unexpected translation response format');
    }

    // data[0] contains array of sentence translation segments [[translatedChunk, originalChunk], ...]
    const translatedText = data[0]
      .filter((segment: unknown[]) => segment && typeof segment[0] === 'string')
      .map((segment: string[]) => segment[0])
      .join('');

    return translatedText || text;
  }

  async getLearningData(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    translatedText: string
  ): Promise<LearningDetails> {
    let transliteration: string | undefined;

    try {
      // Query with romanization requested
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=rm&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        // data[0][data[0].length - 1][3] or data[0][1] often contains romanization
        if (Array.isArray(data[0])) {
          for (const item of data[0]) {
            if (Array.isArray(item) && item[3]) {
              transliteration = String(item[3]);
              break;
            }
          }
        }
      }
    } catch {
      // graceful fallback
    }

    return {
      transliteration,
      pronunciation: transliteration ? `Phonetic: /${transliteration}/` : undefined,
      literalMeaning: `Direct contextual expression in ${targetLanguage.toUpperCase()}`,
      exampleSentence: {
        source: text.length < 50 ? `${text} (e.g. Daily conversation)` : text,
        target: translatedText,
      },
    };
  }
}
