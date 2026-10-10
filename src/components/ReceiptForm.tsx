import React, { useState } from 'react';
import {
  DonorDetails,
  OrgDetails,
  PaymentMode,
  RelationType,
  IdType,
  TransactionDetails
} from '../types/receipt';
import { ANUDAN_OPTIONS, DAAN_OPTIONS, DEFAULT_JAGANNATH_LOGO } from '../utils/defaultData';
import { formatAmountInOdia, numberToWords } from '../utils/numberToWords';
import {
  Building2,
  Calendar,
  CreditCard,
  FileCheck2,
  HelpCircle,
  Image,
  PenTool,
  Printer,
  RefreshCw,
  Sparkles,
  Upload,
  UserCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ReceiptFormProps {
  donor: DonorDetails;
  setDonor: React.Dispatch<React.SetStateAction<DonorDetails>>;
  transaction: TransactionDetails;
  setTransaction: React.Dispatch<React.SetStateAction<TransactionDetails>>;
  org: OrgDetails;
  setOrg: React.Dispatch<React.SetStateAction<OrgDetails>>;
  onGeneratePdf: () => void;
  onDirectPrint: () => void;
  onSaveToHistory: () => void;
  onOpenSignaturePad: () => void;
  onFillSample: () => void;
  onShareWhatsApp: () => void;
  isGeneratingPdf: boolean;
}

const AMOUNT_PRESETS = [101, 251, 501, 1001, 2101, 5001, 11000, 21000];

const TITHI_SUGGESTIONS = [
  'କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା',
  'ପବିତ୍ର ରଥଯାତ୍ରା',
  'ଦେବସ୍ନାନ ପୂର୍ଣ୍ଣିମା',
  'ମାଘ ସପ୍ତମୀ',
  'ଜନ୍ମଦିନ',
  'ବିବାହ ବାର୍ଷିକୀ'
];

export const ReceiptForm: React.FC<ReceiptFormProps> = ({
  donor,
  setDonor,
  transaction,
  setTransaction,
  org,
  setOrg,
  onGeneratePdf,
  onDirectPrint,
  onSaveToHistory,
  onOpenSignaturePad,
  onFillSample,
  onShareWhatsApp,
  isGeneratingPdf
}) => {
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  // Logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setOrg((prev) => ({ ...prev, logoUrl: base64 }));
        localStorage.setItem('sansad_savedLogo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Signature file upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setOrg((prev) => ({ ...prev, signatureUrl: base64 }));
        localStorage.setItem('sansad_savedSignature', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnudanToggle = (val: string) => {
    setTransaction((prev) => {
      const exists = prev.selectedAnudan.includes(val);
      const updated = exists
        ? prev.selectedAnudan.filter((item) => item !== val)
        : [...prev.selectedAnudan, val];
      return { ...prev, selectedAnudan: updated };
    });
  };

  const handleDaanToggle = (val: string) => {
    setTransaction((prev) => {
      const exists = prev.selectedDaan.includes(val);
      const updated = exists
        ? prev.selectedDaan.filter((item) => item !== val)
        : [...prev.selectedDaan, val];
      return { ...prev, selectedDaan: updated };
    });
  };

  const generateNextReceiptNo = () => {
    const random = Math.floor(100 + Math.random() * 900);
    setTransaction((prev) => ({ ...prev, receiptNo: `SJS-${random}` }));
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl shadow-md border-t-4 border-orange-600 space-y-6">
      
      {/* Form Header with Quick Actions */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h2 className="text-2xl font-black text-orange-800 tracking-tight">
            ରସିଦ୍ ବିବରଣୀ
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Fill details below • Live A4 preview updates automatically
          </p>
        </div>
        <button
          type="button"
          onClick={onFillSample}
          className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold px-3 py-1.5 rounded-lg border border-orange-200 flex items-center gap-1.5 transition active:scale-95 shadow-xs"
          title="Fill sample donor details to test"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-600" />
          <span>ଉଦାହରଣ (Sample)</span>
        </button>
      </div>

      {/* SECTION 1: Organization Details */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-700" />
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
              ଅନୁଷ୍ଠାନର ବିବରଣୀ (Organization Details)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingOrg(!isEditingOrg)}
            className="text-[11px] font-bold text-orange-700 hover:underline"
          >
            {isEditingOrg ? 'Done Editing' : 'ସଂପାଦନ କରନ୍ତୁ (Edit)'}
          </button>
        </div>

        {isEditingOrg ? (
          <div className="space-y-2 mb-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Org Name (Odia)</label>
              <input
                type="text"
                value={org.nameOdia}
                onChange={(e) => setOrg({ ...org, nameOdia: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Org Name (English)</label>
              <input
                type="text"
                value={org.name}
                onChange={(e) => setOrg({ ...org, name: e.target.value })}
                className="w-full px-2.5 py-1.5 border rounded text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Address</label>
              <textarea
                value={org.addressOdia}
                onChange={(e) => setOrg({ ...org, addressOdia: e.target.value })}
                rows={2}
                className="w-full px-2.5 py-1.5 border rounded text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Registration No"
                value={org.regNo}
                onChange={(e) => setOrg({ ...org, regNo: e.target.value })}
                className="px-2.5 py-1.5 border rounded text-xs"
              />
              <input
                type="text"
                placeholder="PAN No"
                value={org.panNo}
                onChange={(e) => setOrg({ ...org, panNo: e.target.value })}
                className="px-2.5 py-1.5 border rounded text-xs"
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 space-y-1.5">
            <div className="bg-slate-200/70 px-3 py-1.5 rounded text-xs font-bold text-slate-800">
              {org.nameOdia} ({org.name})
            </div>
            <p className="text-[11px] text-slate-600 bg-slate-200/50 p-2 rounded leading-snug">
              {org.addressOdia}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <span className="bg-slate-200/50 px-2 py-1 rounded text-slate-700 font-semibold">
                Reg: {org.regNo}
              </span>
              <span className="bg-slate-200/50 px-2 py-1 rounded text-slate-700 font-semibold">
                PAN: {org.panNo}
              </span>
            </div>
          </div>
        )}

        {/* Permanent Uploaders */}
        <div className="border-t border-slate-300 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-orange-800 font-bold uppercase tracking-wider block flex items-center gap-1">
                <Image className="w-3.5 h-3.5" />
                <span>ଲୋଗୋ (Set Logo)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setOrg((prev) => ({ ...prev, logoUrl: DEFAULT_JAGANNATH_LOGO }));
                  localStorage.removeItem('sansad_savedLogo');
                }}
                className="text-[10px] text-orange-700 hover:underline font-bold"
                title="Reset to official Shree red seal"
              >
                ଶ୍ରୀ ସିଲ୍ (Official Seal)
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-orange-100 file:text-orange-800 hover:file:bg-orange-200 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] text-orange-800 font-bold uppercase tracking-wider block flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5" />
                <span>ସ୍ଵାକ୍ଷର (Signature)</span>
              </label>
              <button
                type="button"
                onClick={onOpenSignaturePad}
                className="text-[10px] text-orange-700 hover:underline font-bold"
              >
                Draw Signature
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-orange-100 file:text-orange-800 hover:file:bg-orange-200 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Transaction Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b pb-1.5">
          <CreditCard className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            କାରବାର ସମ୍ବନ୍ଧୀୟ ତଥ୍ୟ (Transaction)
          </h3>
        </div>

        {/* Receipt No & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-bold">ରସିଦ୍ ନଂ (Receipt No)</label>
              <button
                type="button"
                onClick={generateNextReceiptNo}
                className="text-[10px] text-orange-600 hover:underline flex items-center gap-0.5"
                title="Generate new receipt number"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Next</span>
              </button>
            </div>
            <input
              type="text"
              value={transaction.receiptNo}
              onChange={(e) => setTransaction({ ...transaction, receiptNo: e.target.value })}
              className="w-full px-3 py-2 border border-orange-300 rounded-lg bg-orange-50/70 text-orange-950 font-black text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-600 font-bold">ତାରିଖ (Date)</label>
              <button
                type="button"
                onClick={() => setTransaction({ ...transaction, date: new Date().toISOString().split('T')[0] })}
                className="text-[10px] text-orange-600 hover:underline"
              >
                Today
              </button>
            </div>
            <input
              type="date"
              value={transaction.date}
              onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
        </div>

        {/* Amount & Mode */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1">
              ପରିମାଣ (₹ Amount)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-green-700">₹</span>
              <input
                type="number"
                min="0"
                step="1"
                value={transaction.amount || ''}
                onChange={(e) =>
                  setTransaction({
                    ...transaction,
                    amount: Math.max(0, parseFloat(e.target.value) || 0)
                  })
                }
                className="w-full pl-7 pr-3 py-2 border border-green-300 rounded-lg bg-green-50/60 text-green-900 font-black text-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1">
              ଦାଖଲ ମାଧ୍ୟମ (Payment Mode)
            </label>
            <select
              value={transaction.mode}
              onChange={(e) =>
                setTransaction({ ...transaction, mode: e.target.value as PaymentMode })
              }
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-sm font-semibold focus:ring-2 focus:ring-orange-400 outline-none"
            >
              <option value="ନଗଦ">ନଗଦ (Cash)</option>
              <option value="ଅନଲାଇନ୍">ଅନଲାଇନ୍ (Online / UPI)</option>
              <option value="ଚେକ୍">ଚେକ୍ (Cheque)</option>
            </select>
          </div>
        </div>

        {/* Live Odia Numbers & Words Preview Box */}
        {transaction.amount > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-900 uppercase">
                ଓଡ଼ିଆ ଅଙ୍କରେ (Odia Digits):
              </span>
              <span className="text-base font-black text-orange-950 font-sans">
                {formatAmountInOdia(transaction.amount)}
              </span>
            </div>
            <div className="flex items-start gap-1 pt-1 border-t border-orange-200/60">
              <span className="text-[11px] font-bold text-orange-900 uppercase shrink-0">
                ଓଡ଼ିଆ ଅକ୍ଷରରେ :
              </span>
              <span className="font-bold text-orange-950 text-xs">
                {numberToWords(transaction.amount, { lang: 'or', currency: true })}
              </span>
            </div>
          </div>
        )}

        {/* Quick Amount Chips */}
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
            Quick Amount Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {AMOUNT_PRESETS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTransaction({ ...transaction, amount: amt })}
                className={`text-xs px-2 py-1 rounded-md border font-bold transition ${
                  transaction.amount === amt
                    ? 'bg-green-600 text-white border-green-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction ID */}
        <div>
          <label className="text-xs text-slate-600 font-semibold block mb-1">
            Online Txn ID / Cheque No / Remarks
          </label>
          <input
            type="text"
            value={transaction.txnId}
            onChange={(e) => setTransaction({ ...transaction, txnId: e.target.value })}
            placeholder="ନଗଦ ଜମା ଥିଲେ ଏଠାରେ କେଉଁଠାରେ ଜମା କରାଗଲା ଲେଖନ୍ତୁ କିମ୍ବା UPI Reference ID"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>
      </div>

      {/* SECTION 3: Donor Details */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 border-b pb-1.5">
          <UserCheck className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            ଦାତାଙ୍କ ସମ୍ପୂର୍ଣ ତଥ୍ୟ (Donor Details)
          </h3>
        </div>

        <div>
          <label className="text-xs text-slate-600 font-bold block mb-1">
            ଦାତାଙ୍କ ସମ୍ପୂର୍ଣ ନାମ (Donor Full Name) *
          </label>
          <input
            type="text"
            value={donor.name}
            onChange={(e) => setDonor({ ...donor, name: e.target.value })}
            placeholder="ଯଥା: ସୁଶାନ୍ତ କୁମାର ମହାପାତ୍ର"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Relation type & name */}
        <div className="flex gap-2">
          <div className="w-28 shrink-0">
            <label className="text-[11px] text-slate-500 font-bold block mb-1">ସମ୍ପର୍କ (Relation)</label>
            <select
              value={donor.relationType}
              onChange={(e) => setDonor({ ...donor, relationType: e.target.value as RelationType })}
              className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <option value="ପିତା">ପିତା (S/o, D/o)</option>
              <option value="ମାତା">ମାତା (Mother)</option>
              <option value="ପତ୍ନୀ">ପତ୍ନୀ (W/o)</option>
              <option value="ସ୍ଵାମୀ">ସ୍ଵାମୀ (H/o)</option>
              <option value="ମାର୍ଫତ">ମାର୍ଫତ (C/o)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[11px] text-slate-500 font-bold block mb-1">ସମ୍ପର୍କୀୟଙ୍କ ନାମ (Relative Name)</label>
            <input
              type="text"
              value={donor.relationName}
              onChange={(e) => setDonor({ ...donor, relationName: e.target.value })}
              placeholder="ସମ୍ପର୍କୀୟଙ୍କ ନାମ ଲେଖନ୍ତୁ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="text-xs text-slate-600 font-bold block mb-1">
            ସମ୍ପୂର୍ଣ ଠିକଣା (Full Address)
          </label>
          <textarea
            rows={2}
            value={donor.address}
            onChange={(e) => setDonor({ ...donor, address: e.target.value })}
            placeholder="ଗ୍ରାମ/ସହର, ପୋଷ୍ଟ, ଥାନା, ଜିଲ୍ଲା, ପିନ୍ ନଂ..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
          />
        </div>

        {/* Gotra & ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1">
              ଗୋତ୍ର (Gotra)
            </label>
            <input
              type="text"
              value={donor.gotra}
              onChange={(e) => setDonor({ ...donor, gotra: e.target.value })}
              placeholder="ଯଥା: କାଶ୍ୟପ, ଭରଦ୍ୱାଜ..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1">
              ପରିଚୟ ପତ୍ର (ID Proof)
            </label>
            <div className="flex gap-1.5">
              <select
                value={donor.idType}
                onChange={(e) => setDonor({ ...donor, idType: e.target.value as IdType })}
                className="w-24 px-1.5 py-2 border border-slate-300 rounded-lg bg-slate-50 text-[11px] font-semibold text-slate-700"
              >
                <option value="ପ୍ୟାନ୍">ପ୍ୟାନ୍ (PAN)</option>
                <option value="ଆଧାର">ଆଧାର (Aadhaar)</option>
                <option value="ଭୋଟ ପରିଚୟ">ଭୋଟ ପରିଚୟ (Voter ID)</option>
                <option value="ଅନ୍ୟାନ୍ୟ">ଅନ୍ୟାନ୍ୟ (Others)</option>
              </select>
              <input
                type="text"
                value={donor.idNumber}
                onChange={(e) => setDonor({ ...donor, idNumber: e.target.value })}
                placeholder="ID Number"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1">
              ମୋବାଇଲ୍ ନଂ (Mobile)
            </label>
            <input
              type="tel"
              value={donor.phone}
              onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
              placeholder="୧୦ ଅଙ୍କ ବିଶିଷ୍ଟ ନଂ"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1">
              ଇମେଲ୍‌ ଆଇଡି (Email)
            </label>
            <input
              type="email"
              value={donor.email}
              onChange={(e) => setDonor({ ...donor, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Seva & Purpose Details */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b pb-1.5">
          <Calendar className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-800 text-sm">
            ଦାନ / ସେବା ଉଦ୍ଦେଶ୍ୟ (Purpose of Entry)
          </h3>
        </div>

        {/* 1. Anudan (Dhupa Seva) */}
        <div className="bg-orange-50/80 p-3.5 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-orange-900 uppercase tracking-wide">
              ଅନୁଦାନ (ଧୂପସେବା ନିମନ୍ତେ)
            </span>
            <span className="text-[10px] text-orange-700 bg-orange-200/60 px-2 py-0.5 rounded font-bold">
              Dhupa Seva
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-800">
            {ANUDAN_OPTIONS.map((item) => {
              const isChecked = transaction.selectedAnudan.includes(item);
              const isChariDhupa = item === 'ଚାରିଧୁପ';
              return (
                <label
                  key={item}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer select-none transition ${
                    isChecked
                      ? 'bg-orange-600 text-white font-bold border-orange-700 shadow-xs'
                      : 'bg-white hover:bg-orange-100/50 text-slate-700 border-orange-200'
                  } ${isChariDhupa ? 'col-span-2 sm:col-span-1 border-orange-400 font-bold' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleAnudanToggle(item)}
                    className="mr-2 accent-orange-600 w-4 h-4 rounded"
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-3">
            <label className="text-xs text-orange-900 font-bold block mb-1">
              ନିର୍ଦ୍ଧାରିତ ଧୂପସେବା କେଉଁ ଉଦ୍ଧେଶ୍ୟରେ
            </label>
            <input
              type="text"
              value={transaction.anudanPurpose}
              onChange={(e) => setTransaction({ ...transaction, anudanPurpose: e.target.value })}
              placeholder="ନିର୍ଦ୍ଧାରିତ ଧୂପସେବା କେଉଁ ଉଦ୍ଧେଶ୍ୟରେ"
              className="w-full px-3 py-1.5 border border-orange-300 rounded-lg text-xs bg-white placeholder-slate-400 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
        </div>

        {/* 2. Daan (General / Specific Purposes) */}
        <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-blue-900 uppercase tracking-wide">
              ଦାନ (ଯେକୌଣସି ବାବଦକୁ ଦାଖଲ)
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-200/60 px-2 py-0.5 rounded font-bold">
              General / Special Purpose
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-800">
            {DAAN_OPTIONS.map((item) => {
              const isChecked = transaction.selectedDaan.includes(item);
              return (
                <label
                  key={item}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer select-none transition ${
                    isChecked
                      ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                      : 'bg-white hover:bg-blue-100/50 text-slate-700 border-blue-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleDaanToggle(item)}
                    className="mr-2 accent-blue-600 w-4 h-4 rounded"
                  />
                  <span>{item}</span>
                </label>
              );
            })}
          </div>

          {/* Custom purpose field */}
          <div className="mt-3">
            <input
              type="text"
              value={transaction.customSeva}
              onChange={(e) => setTransaction({ ...transaction, customSeva: e.target.value })}
              placeholder="ଅନ୍ୟ କୌଣସି ଉଦ୍ଦେଶ୍ୟ (Custom Purpose if any)..."
              className="w-full px-3 py-1.5 border border-blue-300 rounded-lg text-xs bg-white placeholder-slate-400 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Designated Day / Tithi */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <label className="text-xs text-slate-700 font-bold block">
            ନିର୍ଦ୍ଧାରିତ ଦିବସ / ତିଥି (Designated Day or Tithi)
          </label>
          <input
            type="text"
            value={transaction.sevaDate}
            onChange={(e) => setTransaction({ ...transaction, sevaDate: e.target.value })}
            placeholder="ଯଥା: କାର୍ତ୍ତିକ ପୂର୍ଣ୍ଣିମା / AUG 15 / ଜନ୍ମଦିନ ଇତ୍ୟାଦି"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <div className="flex flex-wrap gap-1 pt-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase self-center mr-1">
              Suggestions:
            </span>
            {TITHI_SUGGESTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTransaction({ ...transaction, sevaDate: t })}
                className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded hover:bg-slate-100 transition"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION BUTTONS */}
      <div className="pt-4 border-t border-slate-200 space-y-2.5 sticky bottom-0 bg-white/95 backdrop-blur-sm p-2 -mx-2 rounded-xl shadow-lg border border-slate-200">
        
        {/* PDF Download Button */}
        <button
          type="button"
          disabled={isGeneratingPdf}
          onClick={onGeneratePdf}
          className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg shadow-red-600/30 flex justify-center items-center gap-2 border border-red-800 disabled:opacity-75 active:scale-[0.99]"
        >
          {isGeneratingPdf ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating Secure PDF...</span>
            </>
          ) : (
            <>
              <FileCheck2 className="w-5 h-5" />
              <span>Generate Secure PDF (A4 ରସିଦ୍ ଡାଉନଲୋଡ୍)</span>
            </>
          )}
        </button>

        {/* Secondary Row: Direct Print, Save Record, WhatsApp */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onDirectPrint}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow"
            title="Instant direct print on connected printer"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>ପ୍ରିଣ୍ଟ୍ (Print)</span>
          </button>

          <button
            type="button"
            onClick={onSaveToHistory}
            className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow"
            title="Save this receipt to internal register"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>ସଞ୍ଚୟ (Save)</span>
          </button>

          <button
            type="button"
            onClick={onShareWhatsApp}
            className="py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 shadow"
            title="Send receipt details to donor via WhatsApp"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span>ହ୍ୱାଟ୍ସଆପ୍</span>
          </button>
        </div>
      </div>

    </div>
  );
};
