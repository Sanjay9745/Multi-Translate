import { TranslationProvider, LearningDetails } from '../types';
import { GoogleFreeTranslator } from './google-free';

/**
 * AI Translation Provider
 * Translates with deep contextual awareness, preserving idioms, tone,
 * names, numbers, emojis, formatting, and technical terms.
 * Supports Gemini API / OpenAI API / graceful fallback.
 */
export class AITranslator implements TranslationProvider {
  id = 'ai';
  name = 'AI Contextual Translator';

  private geminiKey?: string;
  private openAiKey?: string;
  private fallbackProvider: GoogleFreeTranslator;

  constructor(geminiKey?: string, openAiKey?: string) {
    this.geminiKey = geminiKey || process.env.GEMINI_API_KEY;
    this.openAiKey = openAiKey || process.env.OPENAI_API_KEY;
    this.fallbackProvider = new GoogleFreeTranslator();
  }

  async detectLanguage(text: string): Promise<string> {
    return this.fallbackProvider.detectLanguage(text);
  }

  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    // If Gemini key is provided, use Gemini 1.5/2.0 Flash
    if (this.geminiKey) {
      try {
        const prompt = `You are an expert multilingual translator.
Translate the following source text from ${sourceLanguage} to ${targetLanguage}.
Rules:
1. Translate contextually and idiomatically so it sounds natural to native speakers.
2. Preserve tone, formatting, capitalization, proper names, emojis, numbers, URLs, and code.
3. Return ONLY the translated text without commentary, quotes, or explanations.

Source text:
${text}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 2000 },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (candidate) return candidate;
        }
      } catch (err) {
        console.warn('Gemini translation failed, falling back:', err);
      }
    }

    // If OpenAI key is provided, use OpenAI
    if (this.openAiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert translator. Translate idiomatically and contextually. Return only the translated text.',
              },
              {
                role: 'user',
                content: `Translate from ${sourceLanguage} to ${targetLanguage}:\n${text}`,
              },
            ],
            temperature: 0.2,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.choices?.[0]?.message?.content?.trim();
          if (candidate) return candidate;
        }
      } catch (err) {
        console.warn('OpenAI translation failed, falling back:', err);
      }
    }

    // High quality standard fallback
    return this.fallbackProvider.translate(text, sourceLanguage, targetLanguage);
  }

  async getLearningData(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    translatedText: string
  ): Promise<LearningDetails> {
    if (this.geminiKey) {
      try {
        const prompt = `Analyze this translation:
Source (${sourceLanguage}): "${text}"
Target (${targetLanguage}): "${translatedText}"

Return a valid JSON object with:
{
  "transliteration": "phonetic romanization if target script is non-Latin, otherwise pronunciation guide",
  "pronunciation": "simplified phonetics guide for English speakers",
  "literalMeaning": "breakdown of key words and literal nuance",
  "exampleSentence": {
    "source": "A short realistic example sentence in ${sourceLanguage}",
    "target": "Translation of the example sentence in ${targetLanguage}"
  }
}
Return ONLY valid JSON.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            return JSON.parse(jsonText);
          }
        }
      } catch (e) {
        console.warn('AI learning data generation failed:', e);
      }
    }

    return this.fallbackProvider.getLearningData(text, sourceLanguage, targetLanguage, translatedText);
  }
}
