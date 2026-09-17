export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  ttsCode: string;
  category: 'popular' | 'indian' | 'european' | 'asian' | 'middle-eastern' | 'african' | 'americas' | 'other';
  popular?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  // ==========================================
  // TOP GLOBAL POPULAR LANGUAGES
  // ==========================================
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', direction: 'ltr', ttsCode: 'en-US', category: 'popular', popular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', ttsCode: 'es-ES', category: 'popular', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', ttsCode: 'fr-FR', category: 'popular', popular: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', ttsCode: 'de-DE', category: 'popular', popular: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr', ttsCode: 'it-IT', category: 'popular', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', direction: 'ltr', ttsCode: 'pt-PT', category: 'popular', popular: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr', ttsCode: 'ru-RU', category: 'popular', popular: true },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', direction: 'ltr', ttsCode: 'zh-CN', category: 'popular', popular: true },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', direction: 'ltr', ttsCode: 'zh-TW', category: 'popular', popular: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr', ttsCode: 'ja-JP', category: 'popular', popular: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr', ttsCode: 'ko-KR', category: 'popular', popular: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', ttsCode: 'ar-SA', category: 'popular', popular: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', direction: 'ltr', ttsCode: 'nl-NL', category: 'popular', popular: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr', ttsCode: 'tr-TR', category: 'popular', popular: true },

  // ==========================================
  // INDIAN & SOUTH ASIAN LANGUAGES (ALL MAJOR & SCHEDULED)
  // ==========================================
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', direction: 'ltr', ttsCode: 'ml-IN', category: 'indian', popular: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr', ttsCode: 'hi-IN', category: 'indian', popular: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', direction: 'ltr', ttsCode: 'ta-IN', category: 'indian', popular: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', direction: 'ltr', ttsCode: 'te-IN', category: 'indian', popular: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', direction: 'ltr', ttsCode: 'kn-IN', category: 'indian', popular: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', direction: 'ltr', ttsCode: 'bn-IN', category: 'indian', popular: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', direction: 'ltr', ttsCode: 'mr-IN', category: 'indian', popular: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', direction: 'ltr', ttsCode: 'gu-IN', category: 'indian', popular: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', direction: 'ltr', ttsCode: 'pa-IN', category: 'indian', popular: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', direction: 'rtl', ttsCode: 'ur-PK', category: 'indian', popular: true },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', direction: 'ltr', ttsCode: 'or-IN', category: 'indian' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', direction: 'ltr', ttsCode: 'as-IN', category: 'indian' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', direction: 'ltr', ttsCode: 'hi-IN', category: 'indian' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇳🇵', direction: 'ltr', ttsCode: 'ne-NP', category: 'indian' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰', direction: 'ltr', ttsCode: 'si-LK', category: 'indian' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇵🇰', direction: 'rtl', ttsCode: 'ur-PK', category: 'indian' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر', flag: '🇮🇳', direction: 'rtl', ttsCode: 'ur-PK', category: 'indian' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', direction: 'ltr', ttsCode: 'mr-IN', category: 'indian' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', direction: 'ltr', ttsCode: 'hi-IN', category: 'indian' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', flag: '🇮🇳', direction: 'ltr', ttsCode: 'bn-IN', category: 'indian' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳', direction: 'ltr', ttsCode: 'hi-IN', category: 'indian' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर’', flag: '🇮🇳', direction: 'ltr', ttsCode: 'as-IN', category: 'indian' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', flag: '🇮🇳', direction: 'ltr', ttsCode: 'hi-IN', category: 'indian' },

  // ==========================================
  // EUROPEAN LANGUAGES
  // ==========================================
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', direction: 'ltr', ttsCode: 'el-GR', category: 'european' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', direction: 'ltr', ttsCode: 'sv-SE', category: 'european' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', direction: 'ltr', ttsCode: 'pl-PL', category: 'european' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', direction: 'ltr', ttsCode: 'uk-UA', category: 'european' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', direction: 'ltr', ttsCode: 'cs-CZ', category: 'european' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', direction: 'ltr', ttsCode: 'da-DK', category: 'european' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', direction: 'ltr', ttsCode: 'fi-FI', category: 'european' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', direction: 'ltr', ttsCode: 'no-NO', category: 'european' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', direction: 'ltr', ttsCode: 'hu-HU', category: 'european' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', direction: 'ltr', ttsCode: 'ro-RO', category: 'european' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', direction: 'ltr', ttsCode: 'bg-BG', category: 'european' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', direction: 'ltr', ttsCode: 'hr-HR', category: 'european' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', flag: '🇸🇰', direction: 'ltr', ttsCode: 'sk-SK', category: 'european' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', direction: 'ltr', ttsCode: 'sr-RS', category: 'european' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', flag: '🇸🇮', direction: 'ltr', ttsCode: 'sl-SI', category: 'european' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹', direction: 'ltr', ttsCode: 'lt-LT', category: 'european' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻', direction: 'ltr', ttsCode: 'lv-LV', category: 'european' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪', direction: 'ltr', ttsCode: 'et-EE', category: 'european' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸', direction: 'ltr', ttsCode: 'ca-ES', category: 'european' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskara', flag: '🇪🇸', direction: 'ltr', ttsCode: 'eu-ES', category: 'european' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', flag: '🇪🇸', direction: 'ltr', ttsCode: 'gl-ES', category: 'european' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪', direction: 'ltr', ttsCode: 'ga-IE', category: 'european' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', direction: 'ltr', ttsCode: 'cy-GB', category: 'european' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska', flag: '🇮🇸', direction: 'ltr', ttsCode: 'is-IS', category: 'european' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱', direction: 'ltr', ttsCode: 'sq-AL', category: 'european' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', flag: '🇲🇰', direction: 'ltr', ttsCode: 'mk-MK', category: 'european' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski', flag: '🇧🇦', direction: 'ltr', ttsCode: 'bs-BA', category: 'european' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', flag: '🇧🇾', direction: 'ltr', ttsCode: 'be-BY', category: 'european' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti', flag: '🇲🇹', direction: 'ltr', ttsCode: 'mt-MT', category: 'european' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch', flag: '🇱🇺', direction: 'ltr', ttsCode: 'de-DE', category: 'european' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu', flag: '🇫🇷', direction: 'ltr', ttsCode: 'fr-FR', category: 'european' },
  { code: 'fy', name: 'Western Frisian', nativeName: 'Frysk', flag: '🇳🇱', direction: 'ltr', ttsCode: 'nl-NL', category: 'european' },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', direction: 'ltr', ttsCode: 'en-GB', category: 'european' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', flag: '🇮🇱', direction: 'rtl', ttsCode: 'he-IL', category: 'european' },
  { code: 'la', name: 'Latin', nativeName: 'Latina', flag: '🇻🇦', direction: 'ltr', ttsCode: 'it-IT', category: 'european' },
  { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto', flag: '🌐', direction: 'ltr', ttsCode: 'es-ES', category: 'european' },

  // ==========================================
  // ASIAN & PACIFIC LANGUAGES
  // ==========================================
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr', ttsCode: 'vi-VN', category: 'asian' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', direction: 'ltr', ttsCode: 'th-TH', category: 'asian' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', direction: 'ltr', ttsCode: 'id-ID', category: 'asian' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', direction: 'ltr', ttsCode: 'ms-MY', category: 'asian' },
  { code: 'tl', name: 'Filipino (Tagalog)', nativeName: 'Tagalog', flag: '🇵🇭', direction: 'ltr', ttsCode: 'fil-PH', category: 'asian' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာစာ', flag: '🇲🇲', direction: 'ltr', ttsCode: 'my-MM', category: 'asian' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭', direction: 'ltr', ttsCode: 'km-KH', category: 'asian' },
  { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ', flag: '🇱🇦', direction: 'ltr', ttsCode: 'th-TH', category: 'asian' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', direction: 'ltr', ttsCode: 'id-ID', category: 'asian' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', direction: 'ltr', ttsCode: 'id-ID', category: 'asian' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Sinugboanon', flag: '🇵🇭', direction: 'ltr', ttsCode: 'fil-PH', category: 'asian' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob', flag: '🇱🇦', direction: 'ltr', ttsCode: 'en-US', category: 'asian' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл', flag: '🇲🇳', direction: 'ltr', ttsCode: 'ru-RU', category: 'asian' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད་', flag: '🇨🇳', direction: 'ltr', ttsCode: 'zh-CN', category: 'asian' },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', flag: '🇼🇸', direction: 'ltr', ttsCode: 'en-US', category: 'asian' },
  { code: 'mi', name: 'Maori', nativeName: 'Te Reo Māori', flag: '🇳🇿', direction: 'ltr', ttsCode: 'en-NZ', category: 'asian' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi', flag: '🌺', direction: 'ltr', ttsCode: 'en-US', category: 'asian' },

  // ==========================================
  // MIDDLE EASTERN & CENTRAL ASIAN LANGUAGES
  // ==========================================
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', flag: '🇮🇷', direction: 'rtl', ttsCode: 'fa-IR', category: 'middle-eastern' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', direction: 'rtl', ttsCode: 'he-IL', category: 'middle-eastern' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', direction: 'ltr', ttsCode: 'az-AZ', category: 'middle-eastern' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', nativeName: 'Kurdî', flag: '🇮🇶', direction: 'ltr', ttsCode: 'tr-TR', category: 'middle-eastern' },
  { code: 'ckb', name: 'Kurdish (Sorani)', nativeName: 'کوردی سۆرانی', flag: '🇮🇶', direction: 'rtl', ttsCode: 'ar-SA', category: 'middle-eastern' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🇦🇫', direction: 'rtl', ttsCode: 'fa-IR', category: 'middle-eastern' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ тілі', flag: '🇰🇿', direction: 'ltr', ttsCode: 'ru-RU', category: 'middle-eastern' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha', flag: '🇺🇿', direction: 'ltr', ttsCode: 'ru-RU', category: 'middle-eastern' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', direction: 'ltr', ttsCode: 'ru-RU', category: 'middle-eastern' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲', direction: 'ltr', ttsCode: 'tr-TR', category: 'middle-eastern' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча', flag: '🇰🇬', direction: 'ltr', ttsCode: 'ru-RU', category: 'middle-eastern' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', direction: 'ltr', ttsCode: 'ka-GE', category: 'middle-eastern' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', direction: 'ltr', ttsCode: 'hy-AM', category: 'middle-eastern' },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', flag: '🇨🇳', direction: 'rtl', ttsCode: 'zh-CN', category: 'middle-eastern' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татар теле', flag: '🇷🇺', direction: 'ltr', ttsCode: 'ru-RU', category: 'middle-eastern' },

  // ==========================================
  // AFRICAN LANGUAGES
  // ==========================================
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', direction: 'ltr', ttsCode: 'sw-KE', category: 'african' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', direction: 'ltr', ttsCode: 'am-ET', category: 'african' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', direction: 'ltr', ttsCode: 'yo-NG', category: 'african' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬', direction: 'ltr', ttsCode: 'ig-NG', category: 'african' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', direction: 'ltr', ttsCode: 'ha-NG', category: 'african' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', direction: 'ltr', ttsCode: 'zu-ZA', category: 'african' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦', direction: 'ltr', ttsCode: 'xh-ZA', category: 'african' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦', direction: 'ltr', ttsCode: 'af-ZA', category: 'african' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaaliga', flag: '🇸🇴', direction: 'ltr', ttsCode: 'ar-SA', category: 'african' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: '🇪🇷', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona', flag: '🇿🇼', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy', flag: '🇲🇬', direction: 'ltr', ttsCode: 'fr-FR', category: 'african' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flag: '🇱🇸', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa', flag: '🇲🇼', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'lg', name: 'Luganda', nativeName: 'Oluganda', flag: '🇺🇬', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála', flag: '🇨🇩', direction: 'ltr', ttsCode: 'fr-FR', category: 'african' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', flag: '🇲🇱', direction: 'ltr', ttsCode: 'fr-FR', category: 'african' },
  { code: 'ak', name: 'Akan / Twi', nativeName: 'Twi', flag: '🇬🇭', direction: 'ltr', ttsCode: 'en-US', category: 'african' },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe', flag: '🇬🇭', direction: 'ltr', ttsCode: 'en-US', category: 'african' },

  // ==========================================
  // AMERICAS & INDIGENOUS LANGUAGES
  // ==========================================
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹', direction: 'ltr', ttsCode: 'fr-FR', category: 'americas' },
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi', flag: '🇵🇪', direction: 'ltr', ttsCode: 'es-ES', category: 'americas' },
  { code: 'gn', name: 'Guarani', nativeName: "Avañe'ẽ", flag: '🇵🇾', direction: 'ltr', ttsCode: 'es-ES', category: 'americas' },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', flag: '🇧🇴', direction: 'ltr', ttsCode: 'es-ES', category: 'americas' },
];

export const AUTO_DETECT_LANGUAGE: LanguageInfo = {
  code: 'auto',
  name: 'Auto Detect',
  nativeName: 'Detect Language',
  flag: '✨',
  direction: 'ltr',
  ttsCode: 'en-US',
  category: 'popular',
};

// Default initial targets
export const DEFAULT_TARGET_LANGUAGES = ['en', 'ml', 'hi', 'es', 'fr', 'de'];

export const LANGUAGE_MAP = new Map<string, LanguageInfo>(
  SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang])
);

export function getLanguageInfo(code: string): LanguageInfo | undefined {
  if (code === 'auto') return AUTO_DETECT_LANGUAGE;
  return LANGUAGE_MAP.get(code);
}

export const LANGUAGE_PRESETS = [
  {
    id: 'top-global',
    name: 'Top Global',
    icon: '🌐',
    languages: ['en', 'es', 'fr', 'de', 'zh', 'ar', 'ru', 'ja'],
  },
  {
    id: 'all-indian',
    name: 'All Indian',
    icon: '🇮🇳',
    languages: ['ml', 'hi', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'ur', 'or', 'as', 'sa'],
  },
  {
    id: 'european',
    name: 'European',
    icon: '🇪🇺',
    languages: ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'sv', 'pl', 'uk', 'cs', 'da'],
  },
  {
    id: 'east-asian',
    name: 'East Asian',
    icon: '🌏',
    languages: ['zh', 'zh-TW', 'ja', 'ko', 'vi', 'th', 'id', 'ms', 'tl'],
  },
  {
    id: 'middle-east',
    name: 'Middle Eastern',
    icon: '🕌',
    languages: ['ar', 'fa', 'he', 'tr', 'ur', 'ku', 'ps'],
  },
  {
    id: 'african-nations',
    name: 'African',
    icon: '🌍',
    languages: ['sw', 'am', 'yo', 'ig', 'ha', 'zu', 'xh', 'af', 'so'],
  },
];
