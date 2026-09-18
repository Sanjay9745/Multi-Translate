import {
  TranslationItem,
  TranslationProvider,
  TranslationRequest,
  TranslationResponse,
} from './types';
import { getLanguageInfo } from './languages.config';
import { GoogleFreeTranslator } from './providers/google-free';
import { GoogleCloudTranslator } from './providers/google-cloud';
import { DeepLTranslator } from './providers/deepl';
import { LibreTranslator } from './providers/libre';
import { AITranslator } from './providers/ai';
import { MyMemoryTranslator } from './providers/mymemory';

export class TranslationService {
  private static instance: TranslationService;
  private providers: Map<string, TranslationProvider> = new Map();
  private defaultProviderId: string;

  private constructor() {
    // Register all available providers
    const googleFree = new GoogleFreeTranslator();
    const googleCloud = new GoogleCloudTranslator();
    const deepl = new DeepLTranslator();
    const libre = new LibreTranslator();
    const ai = new AITranslator();
    const mymemory = new MyMemoryTranslator();

    this.providers.set('google-free', googleFree);
    this.providers.set('google-cloud', googleCloud);
    this.providers.set('deepl', deepl);
    this.providers.set('libre', libre);
    this.providers.set('ai', ai);
    this.providers.set('mymemory', mymemory);

    // Read default provider from environment variable
    this.defaultProviderId = process.env.TRANSLATION_PROVIDER || 'google-free';
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  public getProvider(providerId?: string): TranslationProvider {
    const id = providerId || this.defaultProviderId;
    return this.providers.get(id) || this.providers.get('google-free')!;
  }

  public getAvailableProviders(): { id: string; name: string }[] {
    return Array.from(this.providers.values()).map((p) => ({
      id: p.id,
      name: p.name,
    }));
  }

  /**
   * Translates text into multiple target languages simultaneously.
   * Employs concurrency throttling, retries, and partial-failure isolation.
   */
  public async translateMultiple(request: TranslationRequest): Promise<TranslationResponse> {
    const { text, sourceLanguage, targetLanguages, mode = 'quick', provider: requestedProvider } = request;

    if (!text || text.trim().length === 0) {
      throw new Error('Text to translate is required');
    }

    if (!targetLanguages || targetLanguages.length === 0) {
      throw new Error('At least one target language must be selected');
    }

    const provider = this.getProvider(requestedProvider);
    const fallbackProvider = this.providers.get('mymemory')!;

    // 1. Detect source language if set to auto
    let effectiveSourceLang = sourceLanguage;
    let detectedLang: string | undefined;

    if (sourceLanguage === 'auto') {
      try {
        detectedLang = await provider.detectLanguage(text);
        if (!detectedLang || detectedLang === 'auto') {
          detectedLang = await fallbackProvider.detectLanguage(text);
        }
        if (detectedLang && detectedLang !== 'auto') {
          effectiveSourceLang = detectedLang;
        } else {
          effectiveSourceLang = 'en'; // default fallback
        }
      } catch (err) {
        console.warn('Language auto-detection failed, defaulting to en', err);
        effectiveSourceLang = 'en';
      }
    }

    const sourceLangInfo = getLanguageInfo(effectiveSourceLang);

    // 2. Filter out translating from source to identical target
    const filteredTargets = targetLanguages.filter(
      (tl) => tl !== effectiveSourceLang
    );
    const finalTargets = filteredTargets.length > 0 ? filteredTargets : targetLanguages;

    // 3. Parallel controlled execution (batch concurrency = 5)
    const concurrencyLimit = 5;
    const results: TranslationItem[] = [];

    const queue = [...finalTargets];
    const executeJob = async (targetLang: string): Promise<TranslationItem> => {
      const targetLangInfo = getLanguageInfo(targetLang);
      const languageName = targetLangInfo?.name || targetLang;
      const nativeName = targetLangInfo?.nativeName || languageName;
      const flag = targetLangInfo?.flag || '🌐';
      const direction = targetLangInfo?.direction || 'ltr';

      try {
        // Attempt translation with primary provider with timeout
        let translatedText: string;
        try {
          translatedText = await Promise.race([
            provider.translate(text, effectiveSourceLang, targetLang),
            new Promise<string>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout after 8s')), 8000)
            ),
          ]);
        } catch (primErr) {
          console.warn(`Primary provider failed for ${targetLang}, trying fallback...`, primErr);
          try {
            // Try fallback provider (e.g. MyMemory)
            translatedText = await Promise.race([
              fallbackProvider.translate(text, effectiveSourceLang, targetLang),
              new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error('Fallback timeout')), 6000)
              ),
            ]);
          } catch (fallbackErr) {
            console.warn(`Fallback provider failed for ${targetLang}, trying AI provider...`, fallbackErr);
            const aiProvider = this.providers.get('ai');
            if (aiProvider && aiProvider !== provider) {
              translatedText = await Promise.race([
                aiProvider.translate(text, effectiveSourceLang, targetLang),
                new Promise<string>((_, reject) =>
                  setTimeout(() => reject(new Error('AI timeout')), 8000)
                ),
              ]);
            } else {
              throw fallbackErr;
            }
          }
        }

        // If learning mode requested, gather educational metadata
        let learningDetails;
        if (mode === 'learning') {
          try {
            if (provider.getLearningData) {
              learningDetails = await provider.getLearningData(
                text,
                effectiveSourceLang,
                targetLang,
                translatedText
              );
            } else if (fallbackProvider.getLearningData) {
              learningDetails = await fallbackProvider.getLearningData(
                text,
                effectiveSourceLang,
                targetLang,
                translatedText
              );
            }
          } catch {
            // non-fatal
          }
        }

        return {
          language: targetLang,
          languageName,
          nativeName,
          flag,
          direction,
          text: translatedText,
          learning: learningDetails,
          status: 'success',
          provider: provider.name,
        };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Temporarily unavailable';
        return {
          language: targetLang,
          languageName,
          nativeName,
          flag,
          direction,
          text: '',
          status: 'error',
          error: errorMsg.includes('Timeout')
            ? 'Request timed out. Click retry.'
            : 'Translation failed for this language',
        };
      }
    };

    // Process queue with concurrency window
    const runningWorkers: Promise<void>[] = [];
    for (let i = 0; i < Math.min(concurrencyLimit, queue.length); i++) {
      const worker = async () => {
        while (queue.length > 0) {
          const target = queue.shift();
          if (target) {
            const itemResult = await executeJob(target);
            results.push(itemResult);
          }
        }
      };
      runningWorkers.push(worker());
    }

    await Promise.all(runningWorkers);

    // Keep the target language order as originally requested
    results.sort(
      (a, b) => finalTargets.indexOf(a.language) - finalTargets.indexOf(b.language)
    );

    return {
      sourceLanguage: effectiveSourceLang,
      sourceLanguageName: sourceLangInfo?.name || effectiveSourceLang,
      detectedLanguage: detectedLang,
      translations: results,
    };
  }
}
