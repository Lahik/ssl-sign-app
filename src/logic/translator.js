// src/logic/translator.js

// This translation table maps words available in sign video (e.g., hello.mp4)
// to their Sinhala and Tamil equivalents.
// Add more entries as needed, but only for words that have videos.
const TRANSLATION_TABLE = {
  hello: {
    si: ['ආයුබෝවන්', 'හෙලෝ'],
    ta: ['வணக்கம்', 'ஹலோ']
  },
  you: {
    si: ['ඔබ', 'ඔයා'],
    ta: ['நீங்கள்', 'நீ']
  },
  want: {
    si: ['අවශ්යයි'],
    ta: ['வேண்டும்']
  },
  eat: {
    si: ['කන්න'],
    ta: ['சாப்பிட']
  },
  sleep: {
    si: ['නිදියනවා'],
    ta: ['தூங்குவது']
  },
  bye: {
    si: ['ගිහින් එන්නම්'],
    ta: ['பிரியாவிடை']
  }
};

// Supported languages
export const LANGUAGES = ['en', 'si', 'ta'];

// Translate a word from English to all available languages.
export function translateWord(word) {
  const entry = TRANSLATION_TABLE[word.toLowerCase()];
  if (!entry) return { en: word, si: word, ta: word };
  return {
    en: word,
    si: entry.si?.[0] ?? word,
    ta: entry.ta?.[0] ?? word
  };
}

// Translate an array of words (e.g. ["hello", "you"])
export function translateSentenceWords(wordsArray) {
  const translated = {
    en: [],
    si: [],
    ta: []
  };

  for (const word of wordsArray) {
    const t = translateWord(word);
    translated.en.push(t.en);
    translated.si.push(t.si);
    translated.ta.push(t.ta);
  }

  return {
    en: translated.en.join(' '),
    si: translated.si.join(' '),
    ta: translated.ta.join(' ')
  };
}