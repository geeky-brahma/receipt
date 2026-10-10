import { DonorDetails, OrgDetails, TransactionDetails } from '../types/receipt';
import { SHREE_LOGO_IMAGE_DATA } from './logoImage';

// Official Sri Jagannath Sansad "images.jpg" user-uploaded image as base64 data URL
export const DEFAULT_JAGANNATH_LOGO = SHREE_LOGO_IMAGE_DATA;

export const DEFAULT_ORG_DETAILS: OrgDetails = {
  name: 'SRI JAGANNATH SANSAD',
  nameOdia: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ସଂସଦ',
  address: 'GAROI ASHRAM, GAROI, KORUA, NAUGAONHAT, JAGATSINGHPUR, ODISHA, 754113',
  addressOdia: 'ଗାରୋଇ ଆଶ୍ରମ, ଗାରୋଇ, କୋରୁଅ, ନାଉଗାଁ ହାଟ, ଜଗତସିଂହପୁର, ଓଡ଼ିଶା, ୭୫୪୧୧୩',
  regNo: '20,151/115',
  panNo: 'AANAS6423R',
  phones: '୯୪୩୭୩୫୩୦୪୦ / ୯୭୭୭୮୮୭୪୫୯',
  logoUrl: DEFAULT_JAGANNATH_LOGO,
  signatureUrl: '/sign.jpg'
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
  anudanPurpose: '',
  customSeva: '',
  sevaDate: 'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା (Kartika Purnima)',
  showUpiQr: false
};
