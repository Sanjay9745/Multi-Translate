import { NextRequest, NextResponse } from 'next/server';
import { TranslationService } from '@/lib/translation/service';
import { getLanguageInfo } from '@/lib/translation/languages.config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    const service = TranslationService.getInstance();
    const provider = service.getProvider();
    const detected = await provider.detectLanguage(text.trim());

    const langInfo = getLanguageInfo(detected);

    return NextResponse.json({
      language: detected,
      languageName: langInfo?.name || detected,
      nativeName: langInfo?.nativeName || detected,
      flag: langInfo?.flag || '🌐',
    });
  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json({
      language: 'auto',
      languageName: 'Auto Detect',
      nativeName: 'Auto',
      flag: '✨',
    });
  }
}
