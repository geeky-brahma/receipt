import { DonorDetails, OrgDetails, TransactionDetails } from '../types/receipt';

// Beautiful spiritual Jagannath Triad / Chakra emblem SVG data URL for default logo
export const DEFAULT_JAGANNATH_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="60%" stop-color="#c2410c"/>
      <stop offset="100%" stop-color="#7c2d12"/>
    </radialGradient>
    <radialGradient id="gold" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="100%" stop-color="#eab308"/>
    </radialGradient>
  </defs>
  <!-- Outer Sacred Wheel / Chakra Ring -->
  <circle cx="100" cy="100" r="94" fill="url(#sun)" stroke="#ca8a04" stroke-width="5"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="4,4"/>
  <!-- Sudarshan Wheel Rays / Spokes -->
  <g stroke="#fed7aa" stroke-width="2" opacity="0.4">
    <line x1="100" y1="16" x2="100" y2="184"/>
    <line x1="16" y1="100" x2="184" y2="100"/>
    <line x1="40" y1="40" x2="160" y2="160"/>
    <line x1="160" y1="40" x2="40" y2="160"/>
  </g>
  <!-- Inner White Halo -->
  <circle cx="100" cy="100" r="74" fill="#fffbeb" stroke="#ea580c" stroke-width="3"/>
  <!-- Sacred Tilak / Urdhva Pundra Symbol -->
  <path d="M100 34 L107 58 L100 52 L93 58 Z" fill="#dc2626"/>
  <circle cx="100" cy="62" r="4" fill="#ea580c"/>
  
  <!-- Stylized Jagannath Big Round Divine Eyes (Chaka Dola) -->
  <!-- Left Eye -->
  <circle cx="68" cy="98" r="24" fill="#ffffff" stroke="#1c1917" stroke-width="3"/>
  <circle cx="68" cy="98" r="17" fill="#dc2626"/>
  <circle cx="68" cy="98" r="10" fill="#18181b"/>
  <circle cx="65" cy="95" r="3" fill="#ffffff"/>
  
  <!-- Right Eye -->
  <circle cx="132" cy="98" r="24" fill="#ffffff" stroke="#1c1917" stroke-width="3"/>
  <circle cx="132" cy="98" r="17" fill="#dc2626"/>
  <circle cx="132" cy="98" r="10" fill="#18181b"/>
  <circle cx="129" cy="95" r="3" fill="#ffffff"/>

  <!-- Divine Smile / Adhara -->
  <path d="M72 136 Q100 156 128 136" fill="none" stroke="#dc2626" stroke-width="6" stroke-linecap="round"/>

  <!-- Bottom Sacred Inscription Text Ring -->
  <path id="curve" d="M 35 155 A 72 72 0 0 0 165 155" fill="none"/>
  <text font-size="10" font-weight="bold" fill="#7c2d12" letter-spacing="1.5">
    <textPath href="#curve" startOffset="50%" text-anchor="middle">
      ଜୟ ଜଗନ୍ନାଥ ସ୍ଵାମୀ
    </textPath>
  </text>
</svg>
`)}`;

export const DEFAULT_SIGNATURE_STAMP = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80">
  <!-- Stylized Authorized Signatory Cursive Handwriting -->
  <path d="M 20 50 Q 40 18 60 40 T 95 35 T 120 52 T 150 25 T 180 48 T 220 38" 
        fill="none" stroke="#1e3a8a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 35 60 Q 90 54 195 56" fill="none" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Circular Stamp Watermark -->
  <g transform="translate(160, 36) rotate(-12)" opacity="0.75">
    <ellipse cx="0" cy="0" rx="34" ry="24" fill="none" stroke="#dc2626" stroke-width="1.6" stroke-dasharray="3,2"/>
    <text x="0" y="-8" text-anchor="middle" font-size="7.5" font-weight="bold" fill="#dc2626" font-family="sans-serif">SRI JAGANNATH</text>
    <text x="0" y="2" text-anchor="middle" font-size="7" font-weight="bold" fill="#dc2626" font-family="sans-serif">SANSAD</text>
    <text x="0" y="12" text-anchor="middle" font-size="6" font-weight="bold" fill="#dc2626" font-family="sans-serif">★ AUTH. SIGN ★</text>
  </g>
</svg>
`)}`;

export const DEFAULT_ORG_DETAILS: OrgDetails = {
  name: 'SRI JAGANNATH SANSAD',
  nameOdia: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ସଂସଦ',
  address: 'GAROI ASHRAM, GAROI, KORUA, NAUGAONHAT, JAGATSINGHPUR, ODISHA, 754113',
  addressOdia: 'ଗାରୋଇ ଆଶ୍ରମ, ଗାରୋଇ, କୋରୁଅ, ନାଉଗାଁ ହାଟ, ଜଗତସିଂହପୁର, ଓଡ଼ିଶା, ୭୫୪୧୧୩',
  regNo: '20,151/115',
  panNo: 'AANAS6423R',
  phones: '୯୪୩୭୩୫୩୦୪୦ / ୯୭୭୭୮୮୭୪୫୯',
  logoUrl: DEFAULT_JAGANNATH_LOGO,
  signatureUrl: DEFAULT_SIGNATURE_STAMP
};

export const ANUDAN_OPTIONS = [
  'ବଲ୍ଲଭ ଧୂପ',
  'ସକାଳ ଧୂପ',
  'ଦ୍ଵିପ୍ରହର ଧୂପ',
  'ପଣା ଧୂପ',
  'ଚାରିଧୁପ'
];

export const DAAN_OPTIONS = [
  'ଆଶ୍ରମ ଚାନ୍ଦା',
  'ମହୋତ୍ସବ ଖର୍ଚ୍ଚ',
  'ହୁଣ୍ଡି',
  'ମନ୍ଦିର ମରାମତି',
  'ଜନମଙ୍ଗଳ ଓ ସମାଜସେବା',
  'ମୂଳ ପାଣ୍ଠି',
  'ଶ୍ରୀଜୀଉମାନଙ୍କ ଆଭୂଷଣ',
  'ଯାଗଯଜ୍ଞ ଓ ପର୍ବ ପର୍ବାଣୀ',
  'ବିବାହ',
  'ନିର୍ବନ୍ଧ',
  'ବ୍ରତୋପନୟନ',
  'ଅନ୍ୟାନ୍ୟ'
];

export const SAMPLE_DONOR: DonorDetails = {
  name: 'ସୁଶାନ୍ତ କୁମାର ମହାପାତ୍ର',
  relationType: 'ପିତା',
  relationName: 'ବସନ୍ତ କୁମାର ମହାପାତ୍ର',
  address: 'ପ୍ଲଟ ନଂ - ୪୫, ସହିଦ ନଗର, ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା - ୭୫୧୦୦୭',
  gotra: 'କାଶ୍ୟପ (Kashyapa)',
  idType: 'ପ୍ୟାନ୍',
  idNumber: 'ABCDE1234F',
  phone: '9861012345',
  email: 'sushant.mohapatra@example.com'
};

export const SAMPLE_TRANSACTION: TransactionDetails = {
  receiptNo: 'SJS-786',
  date: new Date().toISOString().split('T')[0],
  amount: 2501,
  mode: 'ଅନଲାଇନ୍',
  txnId: 'UPI/428901928491/SBI',
  selectedAnudan: ['ଚାରିଧୁପ'],
  selectedDaan: ['ଆଶ୍ରମ ଚାନ୍ଦା'],
  customSeva: '',
  sevaDate: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା (Kartika Purnima)',
  showUpiQr: false
};
