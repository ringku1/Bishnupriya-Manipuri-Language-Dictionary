// SearchBar Component
// Features:
// - Live suggestions (up to 10) as you type
// - Keyboard navigation (arrow keys, enter, escape)
// - Suggestions remain visible when clicking outside
// - Highlighting of matched text
// - Loading spinner while fetching words
// - Accessibility with ARIA attributes
// - Calls onSelectWord when a word is selected
// - Modern, theme-aware UI
import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

const diacriticMap = {
  // A (uppercase and lowercase base keys)
  A: [
    "A",
    "a",
    "Ā",
    "ā",
    "À",
    "à",
    "Á",
    "á",
    "Â",
    "â",
    "Ä",
    "ä",
    "Ã",
    "ã",
    "Ă",
    "ă",
    "Ȧ",
    "ȧ",
    "Ǡ",
    "ǡ",
    "Ǻ",
    "ǻ",
    "Ǟ",
    "ǟ",
    "Ǎ",
    "ǎ",
    "Ą",
    "ą",
    "Å",
    "å",
    "Ạ",
    "ạ",
    "Ả",
    "ả",
    "Ấ",
    "ấ",
    "Ầ",
    "ầ",
    "Ẩ",
    "ẩ",
    "Ẫ",
    "ẫ",
    "Ậ",
    "ậ",
    "Ắ",
    "ắ",
    "Ằ",
    "ằ",
    "Ẳ",
    "ẳ",
    "Ẵ",
    "ẵ",
    "Ặ",
    "ặ",
    "Ḁ",
    "ḁ",
    "Ȃ",
    "ȃ",
  ],
  a: [
    "A",
    "a",
    "Ā",
    "ā",
    "À",
    "à",
    "Á",
    "á",
    "Â",
    "â",
    "Ä",
    "ä",
    "Ã",
    "ã",
    "Ă",
    "ă",
    "Ȧ",
    "ȧ",
    "Ǡ",
    "ǡ",
    "Ǻ",
    "ǻ",
    "Ǟ",
    "ǟ",
    "Ǎ",
    "ǎ",
    "Ą",
    "ą",
    "Å",
    "å",
    "Ạ",
    "ạ",
    "Ả",
    "ả",
    "Ấ",
    "ấ",
    "Ầ",
    "ầ",
    "Ẩ",
    "ẩ",
    "Ẫ",
    "ẫ",
    "Ậ",
    "ậ",
    "Ắ",
    "ắ",
    "Ằ",
    "ằ",
    "Ẳ",
    "ẳ",
    "Ẵ",
    "ẵ",
    "Ặ",
    "ặ",
    "Ḁ",
    "ḁ",
    "Ȃ",
    "ȃ",
  ],

  // B (uppercase and lowercase base keys)
  B: [
    "B",
    "b",
    "Ḃ",
    "ḃ",
    "Ḅ",
    "ḅ",
    "Ḇ",
    "ḇ",
    "Ɓ",
    "ɓ",
    "Ƃ",
    "ƃ",
    "Ƀ",
    "ƀ",
    "ᵬ",
    "ᶀ",
  ],
  b: [
    "B",
    "b",
    "Ḃ",
    "ḃ",
    "Ḅ",
    "ḅ",
    "Ḇ",
    "ḇ",
    "Ɓ",
    "ɓ",
    "Ƃ",
    "ƃ",
    "Ƀ",
    "ƀ",
    "ᵬ",
    "ᶀ",
  ],

  // C (uppercase and lowercase base keys)
  C: [
    "C",
    "c",
    "Ç",
    "ç",
    "Č",
    "č",
    "Ĉ",
    "ĉ",
    "Ć",
    "ć",
    "Ḉ",
    "ḉ",
    "Ċ",
    "ċ",
    "Ƈ",
    "ƈ",
    "Ȼ",
    "ȼ",
    "Ꜿ",
    "ꜿ",
    "ᶗ",
    "ᶜ",
  ],
  c: [
    "C",
    "c",
    "Ç",
    "ç",
    "Č",
    "č",
    "Ĉ",
    "ĉ",
    "Ć",
    "ć",
    "Ḉ",
    "ḉ",
    "Ċ",
    "ċ",
    "Ƈ",
    "ƈ",
    "Ȼ",
    "ȼ",
    "Ꜿ",
    "ꜿ",
    "ᶗ",
    "ᶜ",
  ],

  // D (uppercase and lowercase base keys)
  D: [
    "D",
    "d",
    "Ď",
    "ď",
    "Ḋ",
    "ḋ",
    "Ḑ",
    "ḑ",
    "Ḍ",
    "ḍ",
    "Ḓ",
    "ḓ",
    "Ḏ",
    "ḏ",
    "Đ",
    "đ",
    "Ɗ",
    "ɗ",
    "Ƌ",
    "ƌ",
    "ᵭ",
    "ᶁ",
    "ᶑ",
  ],
  d: [
    "D",
    "d",
    "Ď",
    "ď",
    "Ḋ",
    "ḋ",
    "Ḑ",
    "ḑ",
    "Ḍ",
    "ḍ",
    "Ḓ",
    "ḓ",
    "Ḏ",
    "ḏ",
    "Đ",
    "đ",
    "Ɗ",
    "ɗ",
    "Ƌ",
    "ƌ",
    "ᵭ",
    "ᶁ",
    "ᶑ",
  ],

  // E (uppercase and lowercase base keys)
  E: [
    "E",
    "e",
    "Ē",
    "ē",
    "È",
    "è",
    "É",
    "é",
    "Ê",
    "ê",
    "Ë",
    "ë",
    "Ĕ",
    "ĕ",
    "Ė",
    "ė",
    "Ę",
    "ę",
    "Ě",
    "ě",
    "Ȩ",
    "ȩ",
    "Ȅ",
    "ȅ",
    "Ȇ",
    "ȇ",
    "Ẹ",
    "ẹ",
    "Ẻ",
    "ẻ",
    "Ẽ",
    "ẽ",
    "Ế",
    "ế",
    "Ề",
    "ề",
    "Ể",
    "ể",
    "Ễ",
    "ễ",
    "Ệ",
    "ệ",
    "Ḙ",
    "ḙ",
    "Ḛ",
    "ḛ",
    "ᶒ",
  ],
  e: [
    "E",
    "e",
    "Ē",
    "ē",
    "È",
    "è",
    "É",
    "é",
    "Ê",
    "ê",
    "Ë",
    "ë",
    "Ĕ",
    "ĕ",
    "Ė",
    "ė",
    "Ę",
    "ę",
    "Ě",
    "ě",
    "Ȩ",
    "ȩ",
    "Ȅ",
    "ȅ",
    "Ȇ",
    "ȇ",
    "Ẹ",
    "ẹ",
    "Ẻ",
    "ẻ",
    "Ẽ",
    "ẽ",
    "Ế",
    "ế",
    "Ề",
    "ề",
    "Ể",
    "ể",
    "Ễ",
    "ễ",
    "Ệ",
    "ệ",
    "Ḙ",
    "ḙ",
    "Ḛ",
    "ḛ",
    "ᶒ",
  ],

  // F (uppercase and lowercase base keys)
  F: ["F", "f", "Ḟ", "ḟ", "Ƒ", "ƒ", "ᵮ", "ᶂ"],
  f: ["F", "f", "Ḟ", "ḟ", "Ƒ", "ƒ", "ᵮ", "ᶂ"],

  // G (uppercase and lowercase base keys)
  G: [
    "G",
    "g",
    "Ĝ",
    "ĝ",
    "Ǵ",
    "ǵ",
    "Ğ",
    "ğ",
    "Ġ",
    "ġ",
    "Ģ",
    "ģ",
    "Ǧ",
    "ǧ",
    "Ǥ",
    "ǥ",
    "Ɠ",
    "ɠ",
    "ɢ",
    "Ḡ",
    "ḡ",
    "ᶃ",
  ],
  g: [
    "G",
    "g",
    "Ĝ",
    "ĝ",
    "Ǵ",
    "ǵ",
    "Ğ",
    "ğ",
    "Ġ",
    "ġ",
    "Ģ",
    "ģ",
    "Ǧ",
    "ǧ",
    "Ǥ",
    "ǥ",
    "Ɠ",
    "ɠ",
    "ɢ",
    "Ḡ",
    "ḡ",
    "ᶃ",
  ],

  // H (uppercase and lowercase base keys)
  H: [
    "H",
    "h",
    "Ĥ",
    "ĥ",
    "Ḣ",
    "ḣ",
    "Ḧ",
    "ḧ",
    "Ḩ",
    "ḩ",
    "Ḫ",
    "ḫ",
    "Ħ",
    "ħ",
    "Ȟ",
    "ȟ",
    "Ⱨ",
    "ⱨ",
    "Ⱶ",
    "ⱶ",
    "ᶖ",
  ],
  h: [
    "H",
    "h",
    "Ĥ",
    "ĥ",
    "Ḣ",
    "ḣ",
    "Ḧ",
    "ḧ",
    "Ḩ",
    "ḩ",
    "Ḫ",
    "ḫ",
    "Ħ",
    "ħ",
    "Ȟ",
    "ȟ",
    "Ⱨ",
    "ⱨ",
    "Ⱶ",
    "ⱶ",
    "ᶖ",
  ],

  // I (uppercase and lowercase base keys)
  I: [
    "I",
    "i",
    "Ī",
    "ī",
    "Ì",
    "ì",
    "Í",
    "í",
    "Î",
    "î",
    "Ï",
    "ï",
    "Ĭ",
    "ĭ",
    "Į",
    "į",
    "İ",
    "i",
    "ı",
    "Ɨ",
    "ɨ",
    "Ỉ",
    "ỉ",
    "Ị",
    "ị",
    "Ḭ",
    "ḭ",
    "ᶤ",
  ],
  i: [
    "I",
    "i",
    "Ī",
    "ī",
    "Ì",
    "ì",
    "Í",
    "í",
    "Î",
    "î",
    "Ï",
    "ï",
    "Ĭ",
    "ĭ",
    "Į",
    "į",
    "İ",
    "i",
    "ı",
    "Ɨ",
    "ɨ",
    "Ỉ",
    "ỉ",
    "Ị",
    "ị",
    "Ḭ",
    "ḭ",
    "ᶤ",
  ],

  // J (uppercase and lowercase base keys)
  J: ["J", "j", "Ĵ", "ĵ", "Ɉ", "ɉ", "ǰ", "ȷ", "ᶨ"],
  j: ["J", "j", "Ĵ", "ĵ", "Ɉ", "ɉ", "ǰ", "ȷ", "ᶨ"],

  // K (uppercase and lowercase base keys)
  K: [
    "K",
    "k",
    "Ḱ",
    "ḱ",
    "Ǩ",
    "ǩ",
    "Ķ",
    "ķ",
    "Ḳ",
    "ḳ",
    "Ḵ",
    "ḵ",
    "Ƙ",
    "ƙ",
    "Ⱪ",
    "ⱪ",
    "ᶄ",
  ],
  k: [
    "K",
    "k",
    "Ḱ",
    "ḱ",
    "Ǩ",
    "ǩ",
    "Ķ",
    "ķ",
    "Ḳ",
    "ḳ",
    "Ḵ",
    "ḵ",
    "Ƙ",
    "ƙ",
    "Ⱪ",
    "ⱪ",
    "ᶄ",
  ],

  // L (uppercase and lowercase base keys)
  L: [
    "L",
    "l",
    "Ĺ",
    "ĺ",
    "Ľ",
    "ľ",
    "Ļ",
    "ļ",
    "Ḷ",
    "ḷ",
    "Ḹ",
    "ḹ",
    "Ḽ",
    "ḽ",
    "Ḻ",
    "ḻ",
    "Ł",
    "ł",
    "Ƚ",
    "ƚ",
    "Ⱡ",
    "ⱡ",
    "Ɫ",
    "ɫ",
    "ᶅ",
    "ᶪ",
  ],
  l: [
    "L",
    "l",
    "Ĺ",
    "ĺ",
    "Ľ",
    "ľ",
    "Ļ",
    "ļ",
    "Ḷ",
    "ḷ",
    "Ḹ",
    "ḹ",
    "Ḽ",
    "ḽ",
    "Ḻ",
    "ḻ",
    "Ł",
    "ł",
    "Ƚ",
    "ƚ",
    "Ⱡ",
    "ⱡ",
    "Ɫ",
    "ɫ",
    "ᶅ",
    "ᶪ",
  ],

  // M (uppercase and lowercase base keys)
  M: ["M", "m", "Ḿ", "ḿ", "Ṁ", "ṁ", "Ṃ", "ṃ", "ᵯ", "ᶆ", "Ɱ"],
  m: ["M", "m", "Ḿ", "ḿ", "Ṁ", "ṁ", "Ṃ", "ṃ", "ᵯ", "ᶆ", "Ɱ"],

  // N (uppercase and lowercase base keys)
  N: [
    "N",
    "n",
    "Ń",
    "ń",
    "Ǹ",
    "ǹ",
    "Ň",
    "ň",
    "Ñ",
    "ñ",
    "Ņ",
    "ņ",
    "Ṋ",
    "ṋ",
    "Ṉ",
    "ṉ",
    "Ṇ",
    "ṇ",
    "Ɲ",
    "ɲ",
    "Ƞ",
    "ƞ",
    "ᵰ",
    "ᶇ",
    "ɳ",
    "ȵ",
  ],
  n: [
    "N",
    "n",
    "Ń",
    "ń",
    "Ǹ",
    "ǹ",
    "Ň",
    "ň",
    "Ñ",
    "ñ",
    "Ņ",
    "ņ",
    "Ṋ",
    "ṋ",
    "Ṉ",
    "ṉ",
    "Ṇ",
    "ṇ",
    "Ɲ",
    "ɲ",
    "Ƞ",
    "ƞ",
    "ᵰ",
    "ᶇ",
    "ɳ",
    "ȵ",
  ],

  // O (uppercase and lowercase base keys)
  O: [
    "O",
    "o",
    "Ō",
    "ō",
    "Ò",
    "ò",
    "Ó",
    "ó",
    "Ô",
    "ô",
    "Ö",
    "ö",
    "Õ",
    "õ",
    "Ŏ",
    "ŏ",
    "Ȯ",
    "ȯ",
    "Ȱ",
    "ȱ",
    "Ő",
    "ő",
    "Ǒ",
    "ǒ",
    "Ǫ",
    "ǫ",
    "Ǭ",
    "ǭ",
    "Ø",
    "ø",
    "Ọ",
    "ọ",
    "Ỏ",
    "ỏ",
    "Ố",
    "ố",
    "Ồ",
    "ồ",
    "Ổ",
    "ổ",
    "Ỗ",
    "ỗ",
    "Ộ",
    "ộ",
    "Ớ",
    "ớ",
    "Ờ",
    "ờ",
    "Ở",
    "ở",
    "Ỡ",
    "ỡ",
    "Ợ",
    "ợ",
    "Ɵ",
    "ɵ",
    "Ơ",
    "ơ",
    "Ṍ",
    "ṍ",
    "Ṏ",
    "ṏ",
    "Ṑ",
    "ṑ",
    "Ṓ",
    "ṓ",
    "ⱺ",
  ],
  o: [
    "O",
    "o",
    "Ō",
    "ō",
    "Ò",
    "ò",
    "Ó",
    "ó",
    "Ô",
    "ô",
    "Ö",
    "ö",
    "Õ",
    "õ",
    "Ŏ",
    "ŏ",
    "Ȯ",
    "ȯ",
    "Ȱ",
    "ȱ",
    "Ő",
    "ő",
    "Ǒ",
    "ǒ",
    "Ǫ",
    "ǫ",
    "Ǭ",
    "ǭ",
    "Ø",
    "ø",
    "Ọ",
    "ọ",
    "Ỏ",
    "ỏ",
    "Ố",
    "ố",
    "Ồ",
    "ồ",
    "Ổ",
    "ổ",
    "Ỗ",
    "ỗ",
    "Ộ",
    "ộ",
    "Ớ",
    "ớ",
    "Ờ",
    "ờ",
    "Ở",
    "ở",
    "Ỡ",
    "ỡ",
    "Ợ",
    "ợ",
    "Ɵ",
    "ɵ",
    "Ơ",
    "ơ",
    "Ṍ",
    "ṍ",
    "Ṏ",
    "ṏ",
    "Ṑ",
    "ṑ",
    "Ṓ",
    "ṓ",
    "ⱺ",
  ],

  // P (uppercase and lowercase base keys)
  P: ["P", "p", "Ṕ", "ṕ", "Ṗ", "ṗ", "Ƥ", "ƥ", "Ᵽ", "ᵽ", "ᶈ"],
  p: ["P", "p", "Ṕ", "ṕ", "Ṗ", "ṗ", "Ƥ", "ƥ", "Ᵽ", "ᵽ", "ᶈ"],

  // Q (uppercase and lowercase base keys)
  Q: ["Q", "q", "Ɋ", "ɋ", "ᶐ"],
  q: ["Q", "q", "Ɋ", "ɋ", "ᶐ"],

  // R (uppercase and lowercase base keys)
  R: [
    "R",
    "r",
    "Ŕ",
    "ŕ",
    "Ř",
    "ř",
    "Ṙ",
    "ṙ",
    "Ŗ",
    "ŗ",
    "Ȑ",
    "ȑ",
    "Ȓ",
    "ȓ",
    "Ṛ",
    "ṛ",
    "Ṝ",
    "ṝ",
    "Ṟ",
    "ṟ",
    "Ʀ",
    "ʀ",
    "ᵲ",
    "ᶉ",
    "ɍ",
    "ɽ",
  ],
  r: [
    "R",
    "r",
    "Ŕ",
    "ŕ",
    "Ř",
    "ř",
    "Ṙ",
    "ṙ",
    "Ŗ",
    "ŗ",
    "Ȑ",
    "ȑ",
    "Ȓ",
    "ȓ",
    "Ṛ",
    "ṛ",
    "Ṝ",
    "ṝ",
    "Ṟ",
    "ṟ",
    "Ʀ",
    "ʀ",
    "ᵲ",
    "ᶉ",
    "ɍ",
    "ɽ",
  ],

  // S (uppercase and lowercase base keys)
  S: [
    "S",
    "s",
    "Ś",
    "ś",
    "Ŝ",
    "ŝ",
    "Š",
    "š",
    "Ṡ",
    "ṡ",
    "Ş",
    "ş",
    "Ș",
    "ș",
    "Ṣ",
    "ṣ",
    "Ṥ",
    "ṥ",
    "Ṧ",
    "ṧ",
    "Ṩ",
    "ṩ",
    "Ƨ",
    "ƨ",
    "ᵴ",
    "ᶊ",
    "ʂ",
    "Ȿ",
    "ȿ",
  ],
  s: [
    "S",
    "s",
    "Ś",
    "ś",
    "Ŝ",
    "ŝ",
    "Š",
    "š",
    "Ṡ",
    "ṡ",
    "Ş",
    "ş",
    "Ș",
    "ș",
    "Ṣ",
    "ṣ",
    "Ṥ",
    "ṥ",
    "Ṧ",
    "ṧ",
    "Ṩ",
    "ṩ",
    "Ƨ",
    "ƨ",
    "ᵴ",
    "ᶊ",
    "ʂ",
    "Ȿ",
    "ȿ",
  ],

  // T (uppercase and lowercase base keys)
  T: [
    "T",
    "t",
    "Ť",
    "ť",
    "Ṫ",
    "ṫ",
    "Ţ",
    "ţ",
    "Ṭ",
    "ṭ",
    "Ț",
    "ț",
    "Ṱ",
    "ṱ",
    "Ṯ",
    "ṯ",
    "Ƭ",
    "ƭ",
    "Ʈ",
    "ʈ",
    "ȶ",
    "ᵵ",
    "ᶵ",
  ],
  t: [
    "T",
    "t",
    "Ť",
    "ť",
    "Ṫ",
    "ṫ",
    "Ţ",
    "ţ",
    "Ṭ",
    "ṭ",
    "Ț",
    "ț",
    "Ṱ",
    "ṱ",
    "Ṯ",
    "ṯ",
    "Ƭ",
    "ƭ",
    "Ʈ",
    "ʈ",
    "ȶ",
    "ᵵ",
    "ᶵ",
  ],

  // U (uppercase and lowercase base keys)
  U: [
    "U",
    "u",
    "Ū",
    "ū",
    "Ù",
    "ù",
    "Ú",
    "ú",
    "Û",
    "û",
    "Ü",
    "ü",
    "Ŭ",
    "ŭ",
    "Ů",
    "ů",
    "Ű",
    "ű",
    "Ũ",
    "ũ",
    "Ų",
    "ų",
    "Ǔ",
    "ǔ",
    "Ȕ",
    "ȕ",
    "Ȗ",
    "ȗ",
    "Ụ",
    "ụ",
    "Ủ",
    "ủ",
    "Ứ",
    "ứ",
    "Ừ",
    "ừ",
    "Ử",
    "ử",
    "Ữ",
    "ữ",
    "Ự",
    "ự",
    "Ư",
    "ư",
    "Ṳ",
    "ṳ",
    "Ṵ",
    "ṵ",
    "Ṷ",
    "ṷ",
    "Ṹ",
    "ṹ",
    "Ṻ",
    "ṻ",
    "ᶙ",
  ],
  u: [
    "U",
    "u",
    "Ū",
    "ū",
    "Ù",
    "ù",
    "Ú",
    "ú",
    "Û",
    "û",
    "Ü",
    "ü",
    "Ŭ",
    "ŭ",
    "Ů",
    "ů",
    "Ű",
    "ű",
    "Ũ",
    "ũ",
    "Ų",
    "ų",
    "Ǔ",
    "ǔ",
    "Ȕ",
    "ȕ",
    "Ȗ",
    "ȗ",
    "Ụ",
    "ụ",
    "Ủ",
    "ủ",
    "Ứ",
    "ứ",
    "Ừ",
    "ừ",
    "Ử",
    "ử",
    "Ữ",
    "ữ",
    "Ự",
    "ự",
    "Ư",
    "ư",
    "Ṳ",
    "ṳ",
    "Ṵ",
    "ṵ",
    "Ṷ",
    "ṷ",
    "Ṹ",
    "ṹ",
    "Ṻ",
    "ṻ",
    "ᶙ",
  ],

  // V (uppercase and lowercase base keys)
  V: ["V", "v", "Ṽ", "ṽ", "Ṿ", "ṿ", "Ʋ", "ʋ", "ᶌ", "ⱱ", "ⱴ"],
  v: ["V", "v", "Ṽ", "ṽ", "Ṿ", "ṿ", "Ʋ", "ʋ", "ᶌ", "ⱱ", "ⱴ"],

  // W (uppercase and lowercase base keys)
  W: [
    "W",
    "w",
    "Ŵ",
    "ŵ",
    "Ẁ",
    "ẁ",
    "Ẃ",
    "ẃ",
    "Ẅ",
    "ẅ",
    "Ẇ",
    "ẇ",
    "Ẉ",
    "ẉ",
    "ẘ",
    "Ⱳ",
    "ⱳ",
  ],
  w: [
    "W",
    "w",
    "Ŵ",
    "ŵ",
    "Ẁ",
    "ẁ",
    "Ẃ",
    "ẃ",
    "Ẅ",
    "ẅ",
    "Ẇ",
    "ẇ",
    "Ẉ",
    "ẉ",
    "ẘ",
    "Ⱳ",
    "ⱳ",
  ],

  // X (uppercase and lowercase base keys)
  X: ["X", "x", "Ẋ", "ẋ", "Ẍ", "ẍ", "ᶍ"],
  x: ["X", "x", "Ẋ", "ẋ", "Ẍ", "ẍ", "ᶍ"],

  // Y (uppercase and lowercase base keys)
  Y: [
    "Y",
    "y",
    "Ŷ",
    "ŷ",
    "Ẏ",
    "ẏ",
    "Ÿ",
    "ÿ",
    "Ỳ",
    "ỳ",
    "Ỵ",
    "ỵ",
    "Ỷ",
    "ỷ",
    "Ỹ",
    "ỹ",
    "Ȳ",
    "ȳ",
    "Ɏ",
    "ɏ",
    "Ƴ",
    "ƴ",
    "ẙ",
    "Ɀ",
  ],
  y: [
    "Y",
    "y",
    "Ŷ",
    "ŷ",
    "Ẏ",
    "ẏ",
    "Ÿ",
    "ÿ",
    "Ỳ",
    "ỳ",
    "Ỵ",
    "ỵ",
    "Ỷ",
    "ỷ",
    "Ỹ",
    "ỹ",
    "Ȳ",
    "ȳ",
    "Ɏ",
    "ɏ",
    "Ƴ",
    "ƴ",
    "ẙ",
    "Ɀ",
  ],

  // Z (uppercase and lowercase base keys)
  Z: [
    "Z",
    "z",
    "Ź",
    "ź",
    "Ẑ",
    "ẑ",
    "Ž",
    "ž",
    "Ż",
    "ż",
    "Ẓ",
    "ẓ",
    "Ẕ",
    "ẕ",
    "Ƶ",
    "ƶ",
    "Ȥ",
    "ȥ",
    "Ⱬ",
    "ⱬ",
    "ᵶ",
    "ᶎ",
    "ʐ",
    "ʑ",
  ],
  z: [
    "Z",
    "z",
    "Ź",
    "ź",
    "Ẑ",
    "ẑ",
    "Ž",
    "ž",
    "Ż",
    "ż",
    "Ẓ",
    "ẓ",
    "Ẕ",
    "ẕ",
    "Ƶ",
    "ƶ",
    "Ȥ",
    "ȥ",
    "Ⱬ",
    "ⱬ",
    "ᵶ",
    "ᶎ",
    "ʐ",
    "ʑ",
  ],
};

const SearchBar = ({ onSelectWord }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  const isSubsequence = (sub, str) => {
    let subIndex = 0;
    let strIndex = 0;

    // Loop through both strings
    while (subIndex < sub.length && strIndex < str.length) {
      // If characters match, move to the next character in the subsequence
      if (sub[subIndex] === str[strIndex]) {
        subIndex++;
      }
      // Always move to the next character in the main string
      strIndex++;
    }
    // If we matched all characters in the subsequence, it is a subsequence
    return subIndex === sub.length;
  };
  // --- END OF SUBSEQUENCE FUNCTION ---

  const baseCharMap = {};

  Object.entries(diacriticMap).forEach(([baseChar, variants]) => {
    variants.forEach((variant) => {
      baseCharMap[variant] = baseChar.toLowerCase(); // Store all base chars in lowercase
    });
  });
  // --- END OF REVERSE MAPPING ---

  const normalizeString = (str) => {
    return str
      .split("")
      .map((char) => {
        return baseCharMap[char] || char.toLowerCase();
      })
      .join("");
  };
  // --- END OF NORMALIZATION FUNCTION ---
  // Load word list
  useEffect(() => {
    fetch("wordnet.json")
      .then((res) => res.json())
      .then((data) => {
        // Only keep entries with a word field
        setWords(data.filter((w) => typeof w.word === "string"));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load wordnet:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };
  // Filter suggestions dynamically (subsequence anywhere in word)
  useEffect(() => {
    const value = inputValue.trim();
    if (!value) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIdx(-1);
      return;
    }

    // Normalize the user input to its base form OUTSIDE the filter loop
    const normalizedInput = normalizeString(value);

    const filtered = words
      .filter((wordObj) => {
        // Check if the word is a string and exists
        if (typeof wordObj.word !== "string") return false;

        // Normalize the dictionary word to its base form
        const normalizedWord = normalizeString(wordObj.word);

        // Require first letter match
        if (normalizedInput[0] !== normalizedWord[0]) return false;

        // Check if the normalized input is a subsequence of the normalized word
        return isSubsequence(normalizedInput, normalizedWord);
      })
      .slice(0, 50);

    setSuggestions(filtered);
    setShowSuggestions(true);
    setActiveIdx(-1);
  }, [inputValue, words]);

  // Handle suggestion click
  const handleClick = (wordObj) => {
    setInputValue(wordObj.word);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelectWord(wordObj);
  };

  // Handle Enter, ArrowUp, ArrowDown, Escape
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showSuggestions) setShowSuggestions(true);
      setActiveIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      const value = inputValue.trim().toLowerCase();
      if (!value) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      // If a suggestion is highlighted, select it
      if (showSuggestions && activeIdx >= 0 && suggestions[activeIdx]) {
        handleClick(suggestions[activeIdx]);
      } else {
        // Otherwise, do exact match search (same as Search button)
        const normalizedInput = normalizeString(value);
        const exactMatch = words.find(
          (wordObj) =>
            typeof wordObj.word === "string" &&
            normalizeString(wordObj.word) === normalizedInput
        );
        if (exactMatch) {
          setSuggestions([exactMatch]);
          setShowSuggestions(true);
          setActiveIdx(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(true);
          setActiveIdx(-1);
        }
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  };

  // Highlight typed letters
  const highlightMatch = (word) => {
    const value = inputValue.trim();
    const start = word.toLowerCase().indexOf(value.toLowerCase());
    if (start === -1) return word;
    const end = start + value.length;
    return (
      <>
        <span className="highlight">{word.slice(0, start)}</span>
        <span className="highlight-match">{word.slice(start, end)}</span>
        <span className="highlight">{word.slice(end)}</span>
      </>
    );
  };

  return (
    <div className="search-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          Loading words...
        </div>
      )}

      <div className="search-row">
        <input
          ref={inputRef}
          type="text"
          placeholder='Type "ককসি" or "Kaksi"'
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="search-input"
          disabled={loading}
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={
            activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined
          }
          autoComplete="off"
        />
        <button
          className="search-button"
          onClick={() => {
            const value = inputValue.trim();
            if (!value) {
              setSuggestions([]);
              setShowSuggestions(false);
              return;
            }

            // Normalize the user input to its base form
            const normalizedInput = normalizeString(value);

            // Find a word whose normalized form is exactly equal to the normalized input
            const exactMatch = words.find(
              (wordObj) =>
                typeof wordObj.word === "string" &&
                normalizeString(wordObj.word) === normalizedInput
            );

            if (exactMatch) {
              setSuggestions([exactMatch]);
              setShowSuggestions(true);
              setActiveIdx(-1);
            } else {
              setSuggestions([]);
              setShowSuggestions(true);
              setActiveIdx(-1);
            }
          }}
          disabled={loading}
        >
          Search
        </button>
      </div>

      {showSuggestions && !loading && (
        <ul
          className="suggestions-list"
          id="suggestions-list"
          ref={suggestionRef}
        >
          {suggestions.length === 0 ? (
            <li className="no-suggestion">No results found</li>
          ) : (
            suggestions.map((wordObj, idx) => (
              <li
                key={idx}
                id={`suggestion-${idx}`}
                className={activeIdx === idx ? "active" : ""}
                onClick={() => handleClick(wordObj)}
                tabIndex={0}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
              >
                <span className="suggestion-word">
                  {highlightMatch(wordObj.word)}
                </span>
                <span className="suggestion-pos">({wordObj.pos})</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
