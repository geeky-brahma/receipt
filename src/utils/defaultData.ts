import { DonorDetails, OrgDetails, TransactionDetails } from '../types/receipt';
import { SHREE_LOGO_IMAGE_DATA } from './logoImage';

// Official Sri Jagannath Sansad "images.jpg" user-uploaded image as base64 data URL
export const DEFAULT_JAGANNATH_LOGO = SHREE_LOGO_IMAGE_DATA;

export const DEFAULT_SIGNATURE_STAMP = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" width="360" height="120">
  <g fill="none" stroke="#152b5c" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 16 70 C 18 38 30 22 42 30 C 55 39 45 64 22 72 C 56 75 70 54 82 44 C 89 38 91 48 87 61 C 83 76 93 79 104 67 C 116 54 121 39 126 42 C 133 46 121 69 132 72 C 143 76 151 54 159 45 C 166 36 169 50 163 64 C 158 77 169 78 180 65 C 189 55 194 41 201 43 C 208 45 198 66 205 70 C 215 76 226 60 235 51 C 242 44 246 53 240 66 C 234 79 246 78 257 66" stroke-width="4"/>
    <path d="M 28 88 C 76 82 137 85 205 82 C 230 81 247 78 263 73" stroke-width="2.4"/>
    <path d="M 40 29 C 35 15 26 10 20 17" stroke-width="3"/>
  </g>
  <g transform="translate(299 60) rotate(-10)" fill="none" stroke="#c74343" opacity="0.78">
    <circle cx="0" cy="0" r="49" stroke-width="2.5" stroke-dasharray="5 4"/>
    <circle cx="0" cy="0" r="43" stroke-width="1.2"/>
    <path d="M -27 -30 L 27 -30 M -32 30 L 32 30" stroke-width="1.4"/>
    <path d="M -8 -7 L 8 7 M 8 -7 L -8 7" stroke-width="1.5"/>
    <path d="M 0 -12 L 0 12 M -12 0 L 12 0" stroke-width="1"/>
  </g>
  <g transform="translate(299 60) rotate(-10)" fill="#c74343" font-family="Arial, sans-serif" text-anchor="middle" font-weight="700">
    <text x="0" y="-18" font-size="10">SRI JAGANNATH</text>
    <text x="0" y="-4" font-size="11">SANSAD</text>
    <text x="0" y="22" font-size="8">AUTH. SIGN</text>
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
