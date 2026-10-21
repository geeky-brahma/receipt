export type RelationType = 'ପିତା (Father)' | 'ମାତା (Mother)' | 'ପତ୍ନୀ (Wife)' | 'ସ୍ଵାମୀ (Husband)' | 'ମାର୍ଫତ (Child)';

export type PaymentMode = '' | 'ନଗଦ' | 'ଅନଲାଇନ୍' | 'ଚେକ୍';

export type IdType = 'ପ୍ୟାନ୍' | 'ଆଧାର' | 'ଭୋଟ ପରିଚୟ' | 'ଅନ୍ୟାନ୍ୟ';
export type Signatory = 'sunil' | 'biranchi';

export interface OrgDetails {
  name: string;
  nameOdia: string;
  address: string;
  addressOdia: string;
  regNo: string;
  panNo: string;
  phones: string;
  phones_eng: string;
  logoUrl: string;
  signatureUrl: string;
  signatory: Signatory;
}

export interface DonorDetails {
  name: string;
  relationType: null | RelationType;
  relationName: string;
  address: string;
  gotra: string;
  idType: IdType;
  idNumber: string;
  phone: string;
  email: string;
}

export interface TransactionDetails {
  receiptNo: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  txnId: string;
  selectedAnudan: string[]; // e.g. 'ବଲ୍ଲଭ ଧୂପ', 'ସକାଳ ଧୂପ', etc.
  selectedDaan: string[];   // e.g. 'ଆଶ୍ରମ ଚାନ୍ଦା', 'ମହୋତ୍ସବ ଖର୍ଚ୍ଚ', etc.
  anudanPurpose: string;
  customSeva: string;
  sevaDate: string;
  showUpiQr: boolean;
}

export interface ReceiptRecord {
  id: string;
  receiptNo: string;
  date: string;
  createdAt: string;
  donor: DonorDetails;
  transaction: TransactionDetails;
  totalAmount: number;
}
