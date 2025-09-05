import { normalizeWord } from './utils';
import { WORD_TO_VIDEO, SYNONYMS } from './videoMapper';

// Convert sentence to array of video files
export function sentenceToVideos(sentence) {
  const words = sentence
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // remove punctuation
    .split(/\s+/)
    .filter(Boolean);

  const files = [];
  let i = 0;

  while (i < words.length) {
    let found = null;

    // Try to match multi-word phrases (max of 3 words)
    for (let len = 3; len > 0; len--) {
      const phrase = words.slice(i, i + len).join(' ');
      const mapped = SYNONYMS[phrase] ?? phrase;

      if (WORD_TO_VIDEO[mapped]) {
        found = WORD_TO_VIDEO[mapped];
        i += len; // skip ahead by phrase length
        break;
      }
    }

    if (found) {
      files.push(found);
    } else {
      i++; // skip if nothing matched
    }
  }

  return files;
}



// import { normalizeWord, splitSentence } from './utils';
// import { WORD_TO_VIDEO, SYNONYMS } from './videoMapper';

// // Convert sentence to array of video files
// export function sentenceToVideos(sentence) {
//   const words = splitSentence(sentence).map(normalizeWord).filter(Boolean);
//   const files = [];

//   for (const w of words) {
//     const mapped = SYNONYMS[w] ?? w;
//     if (!mapped) continue;
    
//     const file = WORD_TO_VIDEO[mapped];
//     if (file) {
//       files.push(file);
//     }
//   }

//   return files;
// }