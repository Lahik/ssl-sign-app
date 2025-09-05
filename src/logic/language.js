export const LANGS = ['en', 'si', 'ta'];

export function normalizeWord(w) {
  if (!w) return '';
  return w
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '') // strip punctuation (unicode aware)
    .trim();
}
