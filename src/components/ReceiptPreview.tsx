import React, { forwardRef } from 'react';
import { DonorDetails, OrgDetails, TransactionDetails } from '../types/receipt';
import {
  formatIndianDate,
  formatINR,
  formatAmountInOdia,
  toOdiaDigits,
  numberToWords,
  numberToWordsIndian
} from '../utils/numberToWords';

interface ReceiptPreviewProps {
  donor: DonorDetails;
  transaction: TransactionDetails;
  org: OrgDetails;
  id?: string;
}

export const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(({
  donor,
  transaction,
  org,
  id = 'preview-section'
}, ref) => {
  // Determine seva categories title
  const hasAnudan = transaction.selectedAnudan.length > 0 || !!transaction.anudanPurpose;
  const hasDaan = transaction.selectedDaan.length > 0 || !!transaction.customSeva;

  let classificationTitle = 'ଦାନ (Donation / Contribution)';
  if (hasAnudan && !hasDaan) {
    classificationTitle = '(ଅନୁଦାନ) ଧୂପସେବା ନିମନ୍ତେ';
  } else if (hasDaan && !hasAnudan) {
    classificationTitle = '(ଦାନ) ଯେକୌଣସି ଏକ କର୍ମ ନିମନ୍ତେ';
  } else if (hasAnudan && hasDaan) {
    classificationTitle = '(ଅନୁଦାନ) ଏବଂ (ଦାନ)';
  }

  // Combine seva items
  const allSevaItems = [
    ...transaction.selectedAnudan,
    ...(transaction.anudanPurpose ? [transaction.anudanPurpose] : []),
    ...transaction.selectedDaan,
    ...(transaction.customSeva ? [transaction.customSeva] : [])
  ];

  const sevaText = allSevaItems.length > 0 ? allSevaItems.join(', ') : 'ଦୈନିକ ନୀତିକାନ୍ତି / ସାଧାରଣ ଦାନ (General Donation)';
  
  // Odia amount in words & numbers
  const amountInOdiaWords = numberToWords(transaction.amount, { lang: 'or', currency: true });
  const amountInEnglishWords = numberToWordsIndian(transaction.amount);
  const amountInOdiaDigits = formatAmountInOdia(transaction.amount);
  const amountInEnglish = formatINR(transaction.amount);
  const receiptNoOdia = toOdiaDigits(transaction.receiptNo);

  return (
    <div
      ref={ref}
      id={id}
      className="a4-receipt p-12 shadow-2xl flex flex-col justify-between select-none relative bg-white border border-slate-200"
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top and Content */}
      <div className="flex-grow z-10 relative flex flex-col">
        
        {/* Header (3-Column Layout with Centered Sacred Logo) */}
        <div className="flex justify-between items-center border-b-[3px] border-orange-700 pb-5 mb-6">
          {/* Left: Organization Info */}
          <div className="w-[43%]">
            <h1 className="text-[34px] font-black text-orange-700 tracking-tight leading-none mb-1">
              {org.nameOdia || 'ଶ୍ରୀ ଜଗନ୍ନାଥ ସଂସଦ'}
            </h1>
            <p className="text-[12px] font-black text-orange-950 uppercase tracking-wider mb-1">
              {org.name || 'SRI JAGANNATH SANSAD'}
            </p>
            <p className="text-red-700 text-[12px] font-bold leading-snug">
              {org.addressOdia || org.address}
            </p>
            <div className="flex items-center gap-2 text-slate-700 text-[11px] mt-2 font-bold tracking-wide">
              <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 text-orange-900">
                ରେଜିଷ୍ଟ୍ରେସନ: {org.regNo}
              </span>
              <span className="bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 text-orange-900">
                PAN: {org.panNo}
              </span>
            </div>
          </div>

          {/* Center: Sacred Emblem Logo */}
          <div className="w-[18%] flex justify-center items-center">
            <div className="bg-white rounded-full p-1 border-[2.5px] border-orange-300 shadow-md overflow-hidden flex items-center justify-center w-[110px] h-[110px] ring-2 ring-orange-500/20">
              <img
                src={org.logoUrl || '/images.jpg'}
                alt="Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right: Receipt Metadata Table */}
          <div className="w-[39%] text-right flex flex-col items-end pt-1">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-7 py-1.5 rounded-lg mb-3 shadow-sm border border-orange-800">
              <span className="text-[20px] font-black tracking-widest uppercase">ରସିଦ୍</span>
              <span className="text-[11px] ml-1.5 font-bold tracking-wider opacity-90 uppercase">RECEIPT</span>
            </div>
            <table className="text-right text-[13px] border-spacing-y-1">
              <tbody>
                <tr>
                  <td className="text-slate-500 font-semibold pr-2 pb-1">ରସିଦ୍ ନଂ (No):</td>
                  <td className="font-black text-orange-900 pb-1 text-[14px]">
                    {transaction.receiptNo || 'SJS-001'}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-semibold pr-2 pb-1">ତାରିଖ (Date):</td>
                  <td className="font-bold text-slate-900 pb-1">
                    {formatIndianDate(transaction.date)}
                  </td>
                </tr>
                <tr>
                  <td className="text-slate-500 font-semibold pr-2 pb-1">ଜମା ମାଧ୍ୟମ (Mode):</td>
                  <td className="font-bold text-slate-900 pb-1">
                    <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300 text-xs">
                      {transaction.mode}
                    </span>
                  </td>
                </tr>
                {transaction.txnId && (
                  <tr>
                    <td className="text-slate-500 font-semibold pr-2 pb-1 text-[11px]">Txn ID / Cheque:</td>
                    <td className="font-bold text-slate-900 pb-1 text-[11px] font-mono break-all max-w-[180px]">
                      {transaction.txnId}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donor Information Box */}
        <div className="mb-6 bg-[#fdfaf6] p-5 rounded-xl border border-orange-200/80 shadow-xs relative">
          <div className="flex items-center justify-between mb-3 border-b border-orange-200/60 pb-1.5">
            <p className="text-orange-900 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
              <span>ଶ୍ରଦ୍ଧାର ସହିତ ଗ୍ରହଣ କଲୁ (RECEIVED WITH THANKS FROM)</span>
            </p>
            <span className="text-[10px] text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded font-bold">
              DONOR DETAILS
            </span>
          </div>

          <div className="grid grid-cols-[62%_38%] gap-4">
            <div>
              <p className="text-[18px] font-black text-slate-900 uppercase tracking-wide leading-tight break-words">
                {donor.name || 'ଦାତାଙ୍କ ନାମ (Donor Name)'}
              </p>
              
              <p className="text-slate-800 text-[14px] mt-1 font-medium">
                <span className="text-slate-500 font-semibold text-xs uppercase mr-1">
                  {donor.relationType}:
                </span>
                <span className="font-semibold text-slate-800">
                  {donor.relationName || '—'}
                </span>
              </p>

              <p className="text-slate-700 text-[13px] mt-2 leading-relaxed break-words">
                <span className="text-slate-500 font-bold text-xs uppercase mr-1">
                  ଠିକଣା (Address):
                </span>
                <span>{donor.address || 'ଠିକଣା ଉଲ୍ଲିଖିତ ନାହିଁ (Address not provided)'}</span>
              </p>

              <p className="text-slate-800 text-[13px] mt-2">
                <span className="text-slate-500 font-bold text-xs uppercase mr-1">
                  ଗୋତ୍ର (Gotra):
                </span>
                <span className="font-semibold text-orange-950">
                  {donor.gotra || 'ଗୋତ୍ର ଉଲ୍ଲିଖିତ ନାହିଁ'}
                </span>
              </p>
            </div>

            <div className="text-right flex flex-col justify-between items-end space-y-1.5 border-l border-orange-200/80 pl-4">
              <div className="space-y-1 w-full text-right">
                <p className="text-slate-800 text-[13px]">
                  <span className="text-slate-500 font-semibold text-xs uppercase mr-1">ମୋବାଇଲ୍:</span>
                  <span className="font-bold text-slate-900">{donor.phone || '—'}</span>
                </p>
                <p className="text-slate-800 text-[12px] truncate max-w-[240px]">
                  <span className="text-slate-500 font-semibold text-xs uppercase mr-1">ଇମେଲ୍‌:</span>
                  <span className="font-medium text-slate-800">{donor.email || '—'}</span>
                </p>
              </div>

              <div className="bg-white/80 p-2 rounded-lg border border-orange-200 w-full text-right">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  {donor.idType} ନଂ / ID PROOF
                </p>
                <p className="text-slate-900 font-black text-[13px] font-mono tracking-wider">
                  {donor.idNumber ? donor.idNumber.toUpperCase() : 'ପରିଚୟ ପତ୍ର ପ୍ରଦତ୍ତ ନାହିଁ'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <table className="w-full mb-5 border-collapse border border-slate-300 shadow-xs relative z-20 overflow-hidden rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-orange-700 to-orange-800 text-white">
              <th className="py-3 px-5 text-left border border-orange-800 text-[16px] font-black tracking-wide uppercase">
                ସବିଶେଷ ବିବରଣୀ (PARTICULARS)
              </th>
              <th className="py-3 px-5 text-right border border-orange-800 w-60 text-[16px] font-black tracking-wide uppercase">
                ପରିମାଣ (AMOUNT)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-8 px-6 border border-slate-300 align-top bg-white/95">
                <p className="font-black text-orange-900 text-[20px] mb-2 leading-tight">
                  {classificationTitle}
                </p>
                
                <div className="mt-3 pl-4 border-l-[3.5px] border-orange-500 space-y-2">
                  <p className="text-slate-800 text-[15px] leading-relaxed break-words">
                    <span className="font-bold text-slate-600 uppercase text-[12px] tracking-wider mr-1">
                      କେଉଁ ବାବଦକୁ (Purpose):
                    </span>
                    <span className="font-semibold text-slate-950">{sevaText}</span>
                  </p>

                  {(hasAnudan || transaction.sevaDate) && (
                    <p className="text-slate-800 text-[14px]">
                      <span className="font-bold text-slate-600 uppercase text-[12px] tracking-wider mr-1">
                        ନିର୍ଦ୍ଧାରିତ ଦିବସ (Designated Day):
                      </span>
                      <span className="font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {transaction.sevaDate || 'ଯେକୌଣସି ପବିତ୍ର ଦିବସରେ'}
                      </span>
                    </p>
                  )}
                </div>
              </td>
              <td className="py-7 px-6 text-right align-top border border-slate-300 bg-slate-50/90">
                <span className="block text-[11px] font-black uppercase text-orange-800 tracking-wider mb-1">
                  ମୋଟ ପରିମାଣ (TOTAL AMOUNT)
                </span>
                {/* Primary: Amount in Odia Numbers */}
                <p className="text-[34px] font-black text-orange-950 leading-tight tracking-tight">
                  {amountInOdiaDigits}
                </p>
                {/* Secondary: English digits reference */}
                <p className="text-[12px] font-bold text-slate-500 mt-0.5">
                  ({amountInEnglish})
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount in Words */}
        <div className="bg-orange-50/70 p-4 border border-orange-200/90 rounded-xl shadow-xs relative z-20 mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="font-black uppercase tracking-wider text-orange-900 text-xs shrink-0 pt-0.5">
                ଦାଖଲ ପରିମାଣ ଅକ୍ଷରରେ :
              </span>
              {/* Odia words for amount */}
              <span className="font-black text-orange-950 text-[16px] leading-snug">
                {amountInOdiaWords}
              </span>
            </div>
            {/* English words reference */}
            <p className="text-[12px] text-slate-600 pl-0 italic font-medium">
              <span className="font-bold text-slate-500 not-italic mr-1">In Words:</span>
              Rupees {amountInEnglishWords} Only
            </p>
          </div>
        </div>

        {/* Optional UPI QR verification box if enabled */}
        {transaction.showUpiQr && (
          <div className="p-3 bg-amber-50/90 rounded-lg border border-amber-300 text-xs flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white p-1 rounded border border-amber-200 flex items-center justify-center font-mono font-bold text-[9px] text-center text-slate-700">
                [UPI QR]
              </div>
              <div>
                <p className="font-bold text-slate-900">Sri Jagannath Sansad Trust Account</p>
                <p className="text-slate-600 text-[11px]">Direct verified temple contribution deposit</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-1 rounded">
              VERIFIED RECEIPT
            </span>
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="flex justify-between items-end pt-4 border-t border-slate-200 z-20 relative">
        {/* Left: Divine Benediction & Helpline */}
        <div className="w-[58%]">
          <p className="text-[13px] font-black text-orange-700 italic leading-relaxed">
            "ଧନ୍ୟବାଦ ଆପଣଙ୍କ ସହଯୋଗ ପାଇଁ !! ମହାପ୍ରଭୁ ଜଗନ୍ନାଥ ଓ ମହାପୁରୁଷ ବୁଦ୍ଧନାଥ ଆପଣଙ୍କ ମଙ୍ଗଳ କରନ୍ତୁ ।"
          </p>
          <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-wide uppercase">
            ଏହା କମ୍ପୁଟର ଦ୍ଵାରା ପ୍ରସ୍ତୁତ ବୈଧ ରସିଦ୍ ଅଟେ (Computer Generated Valid Receipt)
          </p>
          <p className="text-[11px] text-slate-700 font-bold mt-1">
            ଯୋଗାଯୋଗ ନଂ - {org.phones}
          </p>
        </div>

        {/* Right: Signature & Trust Seal */}
        <div className="w-[38%] text-center flex flex-col items-center justify-end min-h-[110px]">
          {org.signatureUrl ? (
            <div className="relative h-[66px] w-[236px] flex items-center justify-center mb-1">
              <img
                src={org.signatureUrl}
                alt="Authorized Signatory"
                className="h-[60px] w-[220px] object-contain"
                crossOrigin="anonymous"
              />
              <div className="absolute right-0 top-0 h-[68px] w-[68px] rotate-[-10deg] rounded-full border-[2px] border-dashed border-red-700/80 text-red-700/80">
                <div className="absolute inset-[4px] rounded-full border border-red-700/70" />
                <div className="absolute inset-0 flex flex-col items-center justify-center font-sans text-[6px] font-black leading-tight">
                  <span>SRI JAGANNATH</span>
                  <span className="text-[7px]">SANSAD</span>
                  <span className="mt-1 text-[5px]">AUTH. SIGN</span>
                </div>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[12px]">✦</span>
              </div>
            </div>
          ) : (
            <div className="h-[60px]" />
          )}

          <div className="border-b-[2px] border-slate-800 mb-1.5 w-44"></div>
          <p className="text-[13px] font-black text-slate-900 uppercase tracking-wider">
            ଗ୍ରହଣକାରୀଙ୍କ ସ୍ଵାକ୍ଷର
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            AUTHORIZED SIGNATORY
          </p>
          <p className="text-[12px] font-black text-orange-700 mt-0.5 tracking-wide uppercase">
            {org.nameOdia}
          </p>
        </div>
      </div>

      {/* PERMANENT LOCKED AUTHENTIC WATERMARK */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden"
        style={{ opacity: 0.045 }}
      >
        <div className="text-center rotate-[-43deg] select-none leading-none">
          <p className="text-[170px] font-black text-slate-950 tracking-tighter">ଶ୍ରୀ</p>
          <p className="text-[150px] font-black text-slate-950 tracking-tighter">ଜଗନ୍ନାଥ</p>
          <p className="text-[150px] font-black text-slate-950 tracking-tighter">ସଂସଦ</p>
        </div>
      </div>
    </div>
  );
});

ReceiptPreview.displayName = 'ReceiptPreview';
