import { NextRequest, NextResponse } from 'next/server';
import { TranslationService } from '@/lib/translation/service';
import { TranslationRequest } from '@/lib/translation/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TranslationRequest;

    if (!body || typeof body.text !== 'string' || body.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter text to translate' },
        { status: 400 }
      );
    }

    if (body.text.length > 5000) {
      return NextResponse.json(
        { error: 'Text exceeds maximum limit of 5,000 characters' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.targetLanguages) || body.targetLanguages.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one target language' },
        { status: 400 }
      );
    }

    // Limit target languages in single request to 40 for safety and speed
    const sanitizedTargets = body.targetLanguages.slice(0, 40);

    const service = TranslationService.getInstance();
    const result = await service.translateMultiple({
      text: body.text.trim(),
      sourceLanguage: body.sourceLanguage || 'auto',
      targetLanguages: sanitizedTargets,
      mode: body.mode || 'quick',
      provider: body.provider,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Translation route error:', error);
    const message =
      error instanceof Error ? error.message : 'Internal translation service error';
    return NextResponse.json(
      { error: 'Translation service temporarily unavailable. ' + message },
      { status: 500 }
    );
  }
}
