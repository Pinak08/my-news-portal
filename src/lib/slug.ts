// Builds a readable, ASCII-only URL slug from a Gujarati (or English) title,
// e.g. "ગુજરાતમાં ભારે વરસાદ" -> "gujarataman-bhare-varasad".
//
// Gujarati letters are transliterated rather than kept as-is: a raw Gujarati
// URL turns into a long %E0%AA%97... string when shared on WhatsApp.

const CONSONANTS: Record<string, string> = {
  "ક": "k", "ખ": "kh", "ગ": "g", "ઘ": "gh", "ઙ": "n",
  "ચ": "ch", "છ": "chh", "જ": "j", "ઝ": "z", "ઞ": "n",
  "ટ": "t", "ઠ": "th", "ડ": "d", "ઢ": "dh", "ણ": "n",
  "ત": "t", "થ": "th", "દ": "d", "ધ": "dh", "ન": "n",
  "પ": "p", "ફ": "f", "બ": "b", "ભ": "bh", "મ": "m",
  "ય": "y", "ર": "r", "લ": "l", "ળ": "l", "વ": "v",
  "શ": "sh", "ષ": "sh", "સ": "s", "હ": "h",
};

const VOWELS: Record<string, string> = {
  "અ": "a", "આ": "a", "ઇ": "i", "ઈ": "i", "ઉ": "u", "ઊ": "u", "ઋ": "ru",
  "એ": "e", "ઐ": "ai", "ઓ": "o", "ઔ": "au", "ઍ": "e", "ઑ": "o",
};

// Vowel signs that follow a consonant and replace its inherent "a".
const VOWEL_SIGNS: Record<string, string> = {
  "ા": "a", "િ": "i", "ી": "i", "ુ": "u", "ૂ": "u", "ૃ": "ru",
  "ે": "e", "ૈ": "ai", "ો": "o", "ૌ": "au", "ૅ": "e", "ૉ": "o",
};

const OTHERS: Record<string, string> = {
  "ં": "n", "ઁ": "n", "ઃ": "h",
  "૦": "0", "૧": "1", "૨": "2", "૩": "3", "૪": "4",
  "૫": "5", "૬": "6", "૭": "7", "૮": "8", "૯": "9",
};

const VIRAMA = "્";
const NUKTA = "઼";

function transliterateWord(word: string): string {
  const chars = Array.from(word);
  let out = "";
  let endsWithInherentA = false;
  let afterCluster = false; // current consonant follows a virama, e.g. ન્દ્ર
  let syllables = 0;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    endsWithInherentA = false;

    if (CONSONANTS[ch]) {
      afterCluster = chars[i - 1] === VIRAMA;
      out += CONSONANTS[ch];
      let next = chars[i + 1];
      if (next === NUKTA) next = chars[++i + 1];

      if (next && VOWEL_SIGNS[next]) {
        out += VOWEL_SIGNS[next];
        i++;
        syllables++;
      } else if (next === VIRAMA) {
        i++;
      } else {
        out += "a";
        endsWithInherentA = true;
        syllables++;
      }
    } else if (VOWELS[ch]) {
      out += VOWELS[ch];
      syllables++;
    } else if (OTHERS[ch] !== undefined) {
      out += OTHERS[ch];
    } else if (VOWEL_SIGNS[ch] || ch === VIRAMA || ch === NUKTA) {
      // stray sign with no consonant before it: skip
    } else {
      out += ch;
    }
  }

  // Gujarati drops the final inherent vowel when speaking: "વરસાદ" is
  // "varasad", not "varasada". It stays on single-syllable words ("ન" ->
  // "na") and after a cluster ending in ય/ર/વ ("મુખ્ય" -> "mukhya",
  // "કેન્દ્ર" -> "kendra").
  const last = chars[chars.length - 1];
  const keepsA = afterCluster && (last === "ય" || last === "ર" || last === "વ");
  if (endsWithInherentA && syllables > 1 && !keepsA) out = out.slice(0, -1);
  return out;
}

export function slugify(title: string, maxLength = 60): string {
  const slug = title
    .normalize("NFC")
    // Each run of Gujarati script is one word; punctuation and Latin pass through.
    .replace(/[\u0A80-\u0AFF]+/g, transliterateWord)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug.length <= maxLength) return slug;
  // Cut at a word boundary so the URL never ends mid-word.
  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf("-");
  return lastDash > 20 ? cut.slice(0, lastDash) : cut;
}
