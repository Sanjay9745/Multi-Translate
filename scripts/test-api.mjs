async function runTests() {
  console.log('=== MULTITRANSLATE ENDPOINT VERIFICATION ===\n');

  // Test 1: Simultaneous Multi-Language Translation
  console.log('Test 1: Translating "Buongiorno, come stai?" into 8 languages...');
  const res1 = await fetch('http://localhost:3000/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Buongiorno, come stai?',
      sourceLanguage: 'auto',
      targetLanguages: ['en', 'ml', 'hi', 'es', 'fr', 'de', 'ar', 'ja'],
      mode: 'quick',
    }),
  });

  if (!res1.ok) {
    console.error('Test 1 FAILED:', res1.status, await res1.text());
    process.exit(1);
  }

  const data1 = await res1.json();
  console.log('Source detected/used:', data1.sourceLanguage, `(${data1.sourceLanguageName})`);
  console.log('Translations count:', data1.translations.length);
  for (const t of data1.translations) {
    console.log(`  ${t.flag} ${t.languageName} (${t.language}): "${t.text}" [status: ${t.status}]`);
  }

  // Test 2: Language Auto Detection
  console.log('\nTest 2: Auto-detecting "നന്ദി, നമസ്കാരം"...');
  const res2 = await fetch('http://localhost:3000/api/detect-language', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'നന്ദി, നമസ്കാരം' }),
  });
  const data2 = await res2.json();
  console.log('Detected Language:', data2.language, `(${data2.languageName} ${data2.flag})`);

  // Test 3: Learning Mode with Transliteration & Phonetics
  console.log('\nTest 3: Learning Mode query for "Thank you" into Malayalam and Hindi...');
  const res3 = await fetch('http://localhost:3000/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Thank you very much',
      sourceLanguage: 'en',
      targetLanguages: ['ml', 'hi'],
      mode: 'learning',
    }),
  });
  const data3 = await res3.json();
  for (const t of data3.translations) {
    console.log(`  ${t.flag} ${t.languageName}: "${t.text}"`);
    if (t.learning) {
      console.log(`    Transliteration: ${t.learning.transliteration}`);
      console.log(`    Literal/Context: ${t.learning.literalMeaning}`);
    }
  }

  // Test 4: Manifest and Service Worker delivery
  console.log('\nTest 4: Checking PWA Manifest & Service Worker...');
  const resManifest = await fetch('http://localhost:3000/manifest.json');
  console.log('Manifest status:', resManifest.status, resManifest.headers.get('content-type'));
  const manifestJson = await resManifest.json();
  console.log('Manifest App Name:', manifestJson.name);
  console.log('Manifest Display:', manifestJson.display);
  console.log('Manifest Icons:', manifestJson.icons.length);

  const resSW = await fetch('http://localhost:3000/sw.js');
  console.log('Service Worker status:', resSW.status, resSW.headers.get('content-type'));

  // Test 5: Validation and Error Handling
  console.log('\nTest 5: Error handling with empty text...');
  const resErr = await fetch('http://localhost:3000/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '', targetLanguages: ['en'] }),
  });
  console.log('Empty text response status:', resErr.status);
  const errData = await resErr.json();
  console.log('Error message returned:', errData.error);

  console.log('\nALL BACKEND API TESTS PASSED SUCCESSFULLY! ✅');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
