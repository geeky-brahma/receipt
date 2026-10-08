import { DonorDetails, OrgDetails, TransactionDetails } from '../types/receipt';
import { SHREE_LOGO_IMAGE_DATA } from './logoImage';

// Official Sri Jagannath Sansad "images.jpg" user-uploaded image as base64 data URL
export const DEFAULT_JAGANNATH_LOGO = SHREE_LOGO_IMAGE_DATA;

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
