import { ToWords } from 'to-words';

// ============================================================================
// 1. MAP: English Numbers to Odia Numbers (Numbers in Odia Script)
// ============================================================================
export const ENGLISH_TO_ODIA_DIGITS_MAP: Record<string, string> = {
  '0': '୦',
  '1': '୧',
  '2': '୨',
  '3': '୩',
  '4': '୪',
  '5': '୫',
  '6': '୬',
  '7': '୭',
  '8': '୮',
  '9': '୯'
};

/**
 * Converts any numeric value or formatted string to Odia digits
 * e.g., 2500 -> "୨୫୦୦", "2,500.00" -> "୨,୫୦୦.୦୦"
 */
export function toOdiaDigits(input: string | number): string {
  if (input === undefined || input === null) return '';
  const str = input.toString();
  return str
    .split('')
    .map((char) => ENGLISH_TO_ODIA_DIGITS_MAP[char] || char)
    .join('');
}

/**
 * Formats a currency amount into standard Indian comma representation,
 * and converts all digits to Odia script with ₹ symbol.
 * e.g., 26000 -> "₹ ୨୬,୦୦୦/-"
 */
export function formatAmountInOdia(val: number, showSymbol: boolean = true): string {
  if (isNaN(val) || val === null || val === undefined) val = 0;
  
  // Format with Indian thousand/lakh separators
  const formattedEnglish = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: val % 1 === 0 ? 0 : 2
  }).format(val);

  const odiaDigits = toOdiaDigits(formattedEnglish);
  return showSymbol ? `₹ ${odiaDigits}/-` : `${odiaDigits}/-`;
}

// ============================================================================
// 2. NUMBER TO WORDS IN ODIA (with to-words library & native Odia fallback)
// ============================================================================

// Native Odia numbers 1-100 dictionary for exact phonetics
const ODIA_NUMS: Record<number, string> = {
  0: 'ଶୂନ',
  1: 'ଏକ',
  2: 'ଦୁଇ',
  3: 'ତିନି',
  4: 'ଚାରି',
  5: 'ପାଞ୍ଚ',
  6: 'ଛଅ',
  7: 'ସାତ',
  8: 'ଆଠ',
  9: 'ନଅ',
  10: 'ଦଶ',
  11: 'ଏଗାର',
  12: 'ବାର',
  13: 'ତେର',
  14: 'ଚଉଦ',
  15: 'ପନ୍ଦର',
  16: 'ଷୋହଳ',
  17: 'ସତର',
  18: 'ଅଠର',
  19: 'ଉଣେଇଶ',
  20: 'କୋଡ଼ିଏ',
  21: 'ଏକୁଇଶ',
  22: 'ବାଇଶ',
  23: 'ତେଇଶ',
  24: 'ଚବିଶ',
  25: 'ପଚିଶ',
  26: 'ଛବିଶ',
  27: 'ସତାଇଶ',
  28: 'ଅଠାଇଶ',
  29: 'ଅଣତିରିଶ',
  30: 'ତିରିଶ',
  31: 'ଏକତିରିଶ',
  32: 'ବତିଶ',
  33: 'ତେତିଶ',
  34: 'ଚଉତିରିଶ',
  35: 'ପଞ୍ଚତିରିଶ',
  36: 'ଛତିଶ',
  37: 'ସଇଁତିରିଶ',
  38: 'ଅଠତିରିଶ',
  39: 'ଅଣଚାଳିଶ',
  40: 'ଚାଳିଶ',
  41: 'ଏକଚାଳିଶ',
  42: 'ବୟାଳିଶ',
  43: 'ତେୟାଳିଶ',
  44: 'ଚଉରାଳିଶ',
  45: 'ପଞ୍ଚଚାଳିଶ',
  46: 'ଛୟାଳିଶ',
  47: 'ସତଚାଳିଶ',
  48: 'ଅଠଚାଳିଶ',
  49: 'ଅଣଚାଶ',
  50: 'ପଚାଶ',
  51: 'ଏକାବନ',
  52: 'ବାଉନ',
  53: 'ତେପନ',
  54: 'ଚଉବନ',
  55: 'ପଞ୍ଚାବନ',
  56: 'ଛପନ',
  57: 'ସତାବନ',
  58: 'ଅଠାବନ',
  59: 'ଅଣଷଠି',
  60: 'ଷାଠିଏ',
  61: 'ଏକଷଠି',
  62: 'ବାଷଠି',
  63: 'ତେଷଠି',
  64: 'ଚଉଷଠି',
  65: 'ପଞ୍ଚଷଠି',
  66: 'ଛଅଷଠି',
  67: 'ସତଷଠି',
  68: 'ଅଠଷଠି',
  69: 'ଅଣସତୁରି',
  70: 'ସତୁରି',
  71: 'ଏକସ୍ତରୀ',
  72: 'ବାସ୍ତରୀ',
  73: 'ତେସ୍ତରୀ',
  74: 'ଚଉସ୍ତରୀ',
  75: 'ପଞ୍ଚସ୍ତରୀ',
  76: 'ଛଅସ୍ତରୀ',
  77: 'ସତସ୍ତରୀ',
  78: 'ଅଠସ୍ତରୀ',
  79: 'ଅଣଅଶୀ',
  80: 'ଅଶୀ',
  81: 'ଏକାଅଶୀ',
  82: 'ବୟାଅଶୀ',
  83: 'ତେୟାଅଶୀ',
  84: 'ଚଉରାଅଶୀ',
  85: 'ପଞ୍ଚାଅଶୀ',
  86: 'ଛୟାଅଶୀ',
  87: 'ସତାଅଶୀ',
  88: 'ଅଠାଅଶୀ',
  89: 'ଅଣନବ୍ବେ',
  90: 'ନବ୍ବେ',
  91: 'ଏକାନବ୍ବେ',
  92: 'ବୟାନବ୍ବେ',
  93: 'ତେୟାନବ୍ବେ',
  94: 'ଚଉରାନବ୍ବେ',
  95: 'ପଞ୍ଚାନବ୍ବେ',
  96: 'ଛୟାନବ୍ବେ',
  97: 'ସତାନବ୍ବେ',
  98: 'ଅଠାନବ୍ବେ',
  99: 'ଅନେଶତ',
  100: 'ଶହ'
};

function odiaHundreds(n: number): string {
  if (n <= 0) return '';
  if (n <= 100) return ODIA_NUMS[n] || `${n}`;
  const h = Math.floor(n / 100);
  const rem = n % 100;
  let out = '';
  if (h === 1) {
    out = 'ଏକ ଶହ';
  } else if (h > 1) {
    out = (ODIA_NUMS[h] || `${h}`) + ' ଶହ';
  }
  if (rem > 0) {
    out += (out ? ' ' : '') + (ODIA_NUMS[rem] || `${rem}`);
  }
  return out;
}

export function convertNumberToOdiaWords(num: number): string {
  if (isNaN(num) || num === 0) return 'ଶୂନ';
  if (num < 0) return 'ଋଣାତ୍ମକ ' + convertNumberToOdiaWords(Math.abs(num));

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  let n = intPart;
  const parts: string[] = [];

  // Crores
  const crores = Math.floor(n / 10000000);
  n %= 10000000;
  if (crores > 0) {
    parts.push(convertNumberToOdiaWords(crores) + ' କୋଟି');
  }

  // Lakhs
  const lakhs = Math.floor(n / 100000);
  n %= 100000;
  if (lakhs > 0) {
    parts.push((ODIA_NUMS[lakhs] || convertNumberToOdiaWords(lakhs)) + ' ଲକ୍ଷ');
  }

  // Thousands
  const thousands = Math.floor(n / 1000);
  n %= 1000;
  if (thousands > 0) {
    parts.push((ODIA_NUMS[thousands] || convertNumberToOdiaWords(thousands)) + ' ହଜାର');
  }

  // Hundreds & units
  if (n > 0) {
    parts.push(odiaHundreds(n));
  }

  let result = parts.join(' ').trim();
  if (!result) result = 'ଶୂନ';

  if (decPart > 0) {
    result += ` ଏବଂ ${ODIA_NUMS[decPart] || decPart} ପଇସା`;
  }

  return result;
}

// Instance of ToWords configured with or-IN
let toWordsOdiaInstance: ToWords | null = null;
try {
  toWordsOdiaInstance = new ToWords({
    localeCode: 'or-IN',
    converterOptions: {
      currency: false,
      ignoreDecimal: false
    }
  });
} catch (e) {
  console.warn('ToWords or-IN init:', e);
}

/**
 * Main number to words conversion function matching user interface:
 * numberToWords(26000, { lang: 'or' }) -> "ଛବିଶ ହଜାର"
 */
export function numberToWords(
  num: number,
  options?: { lang?: string; currency?: boolean }
): string {
  const lang = options?.lang || 'or';
  const isCurrency = options?.currency !== false; // default true for invoice context

  if (lang === 'or') {
    // Convert to Odia words using our precise Odia generator or library
    let words = convertNumberToOdiaWords(num);

    // If using toWords library as fallback or primary
    if (toWordsOdiaInstance && (!words || words === 'ଶୂନ') && num > 0) {
      try {
        words = toWordsOdiaInstance.convert(num);
      } catch {
        // fallback to native
      }
    }

    if (isCurrency && num > 0) {
      return `${words} ଟଙ୍କା ମାତ୍ର`;
    }
    return words;
  }

  // English fallback
  return numberToWordsIndian(num);
}

// English numbering function (Rupees ... Only)
export function numberToWordsIndian(num: number): string {
  if (isNaN(num) || num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWordsIndian(Math.abs(num));

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit > 0 ? ' ' + ones[unit] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = '';
    if (hundred > 0) {
      res += ones[hundred] + ' Hundred';
    }
    if (rest > 0) {
      if (res) res += ' ';
      res += convertTwoDigits(rest);
    }
    return res;
  }

  let n = integerPart;
  const parts: string[] = [];

  const crores = Math.floor(n / 10000000);
  n %= 10000000;
  if (crores > 0) {
    parts.push(convertThreeDigits(crores) + ' Crore');
  }

  const lakhs = Math.floor(n / 100000);
  n %= 100000;
  if (lakhs > 0) {
    parts.push(convertTwoDigits(lakhs) + ' Lakh');
  }

  const thousands = Math.floor(n / 1000);
  n %= 1000;
  if (thousands > 0) {
    parts.push(convertTwoDigits(thousands) + ' Thousand');
  }

  const hundreds = n;
  if (hundreds > 0) {
    parts.push(convertThreeDigits(hundreds));
  }

  let words = parts.join(' ').trim();
  if (!words) words = 'Zero';

  if (decimalPart > 0) {
    words += ` and ${convertTwoDigits(decimalPart)} Paise`;
  }

  return words;
}

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: val % 1 === 0 ? 0 : 2
  }).format(val || 0);
}

export function formatIndianDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
