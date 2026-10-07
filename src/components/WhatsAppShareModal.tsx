import React, { useState } from 'react';
import { DonorDetails, OrgDetails, TransactionDetails } from '../types/receipt';
import {
  formatINR,
  formatIndianDate,
  formatAmountInOdia,
  numberToWords
} from '../utils/numberToWords';
import { X, Copy, Check, MessageSquare } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorDetails;
  transaction: TransactionDetails;
  org: OrgDetails;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  donor,
  transaction,
  org
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sevaList = [
    ...transaction.selectedAnudan,
    ...transaction.selectedDaan,
    ...(transaction.customSeva ? [transaction.customSeva] : [])
  ].join(', ');

  const odiaAmount = formatAmountInOdia(transaction.amount);
  const odiaWords = numberToWords(transaction.amount, { lang: 'or', currency: true });

  const messageText = `*ଜୟ ଜଗନ୍ନାଥ ସ୍ଵାମୀ ନୟନପଥଗାମୀ ଭବତୁ ମେ* 🙏

*${org.nameOdia || 'ଶ୍ରୀ ଜଗନ୍ନାଥ ସଂସଦ'}*
(${org.name || 'SRI JAGANNATH SANSAD'})
${org.addressOdia || org.address}
Reg: ${org.regNo} | PAN: ${org.panNo}
----------------------------------------
📜 *ରସିଦ୍ ବିବରଣୀ (DONATION RECEIPT)*
• *ରସିଦ୍ ନଂ:* ${transaction.receiptNo}
• *ତାରିଖ:* ${formatIndianDate(transaction.date)}
• *ଦାତାଙ୍କ ନାମ:* ${donor.name || 'ମହାଶୟ/ମହାଶୟା'}
• *ସମ୍ପର୍କ:* ${donor.relationType}: ${donor.relationName || '—'}
• *ଗୋତ୍ର:* ${donor.gotra || '—'}
• *ଦାଖଲ ପରିମାଣ:* ${odiaAmount} (${formatINR(transaction.amount)})
• *ଅକ୍ଷରରେ:* ${odiaWords}
• *ଦାଖଲ ମାଧ୍ୟମ:* ${transaction.mode}${transaction.txnId ? ` (${transaction.txnId})` : ''}
• *ଉଦ୍ଦେଶ୍ୟ:* ${sevaList || 'ଦୈନିକ ନୀତିକାନ୍ତି ଓ ଆଶ୍ରମ ସେବା'}
${transaction.sevaDate ? `• *ନିର୍ଦ୍ଧାରିତ ଦିବସ:* ${transaction.sevaDate}` : ''}
----------------------------------------
"ଧନ୍ୟବାଦ ଆପଣଙ୍କ ସହଯୋଗ ପାଇଁ !! ମହାପ୍ରଭୁ ଜଗନ୍ନାଥ ଓ ମହାପୁରୁଷ ବୁଦ୍ଧନାଥ ଆପଣଙ୍କ ମଙ୍ଗଳ କରନ୍ତୁ ।"
📞 ଯୋଗାଯୋଗ: ${org.phones}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = donor.phone.replace(/[^0-9]/g, '');
  const whatsAppPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsAppUrl = `https://wa.me/${whatsAppPhone}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-bold">ହ୍ୱାଟ୍ସଆପ୍ ବାର୍ତ୍ତା (WhatsApp Receipt Share)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Preview formatted message for donor acknowledgment via WhatsApp or SMS:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-mono whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
            {messageText}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 rounded-xl text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">କପି ହୋଇଗଲା (Copied)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>କପି କରନ୍ତୁ (Copy Message)</span>
                </>
              )}
            </button>

            {donor.phone && (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
