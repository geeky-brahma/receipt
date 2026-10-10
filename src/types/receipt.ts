export type RelationType = 'ପିତା' | 'ମାତା' | 'ପତ୍ନୀ' | 'ସ୍ଵାମୀ' | 'ମାର୍ଫତ';

export type PaymentMode = 'ନଗଦ' | 'ଅନଲାଇନ୍' | 'ଚେକ୍';

export type IdType = 'ପ୍ୟାନ୍' | 'ଆଧାର' | 'ଭୋଟ ପରିଚୟ' | 'ଅନ୍ୟାନ୍ୟ';

export interface OrgDetails {
  name: string;
  nameOdia: string;
  address: string;
  addressOdia: string;
  regNo: string;
  panNo: string;
  phones: string;
  logoUrl: string;
  signatureUrl: string;
}

export interface DonorDetails {
  name: string;
  relationType: RelationType;
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
