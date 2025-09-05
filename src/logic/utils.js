export function normalizeWord(w) {
  if (!w) return '';
  return w
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // strip punctuation
    .trim();
}

// Normalize and split a sentence into an array of words
export function splitSentence(sentence) {
  return sentence.split(/\s+/).map(normalizeWord).filter(Boolean);
}


