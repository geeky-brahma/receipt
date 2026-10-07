/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  DonorDetails,
  OrgDetails,
  ReceiptRecord,
  TransactionDetails
} from './types/receipt';
import {
  DEFAULT_ORG_DETAILS,
  SAMPLE_DONOR,
  SAMPLE_TRANSACTION
} from './utils/defaultData';
import { PasswordModal } from './components/PasswordModal';
import { ReceiptPreview } from './components/ReceiptPreview';
import { ReceiptForm } from './components/ReceiptForm';
import { ReceiptHistoryModal } from './components/ReceiptHistoryModal';
import { SignaturePadModal } from './components/SignaturePadModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import {
  History,
  Lock,
  Printer,
  FileCheck2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  CheckCircle,
  Shield,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // 1. Auth State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('sansad_auth_unlocked') === 'true';
  });

  // 2. Organization State
  const [org, setOrg] = useState<OrgDetails>(() => {
    let savedLogo = localStorage.getItem('sansad_savedLogo');
    // If previously saved logo was any vector SVG, reset to the direct image /images.jpg as requested
    if (savedLogo && (savedLogo.startsWith('data:image/svg') || savedLogo.includes('<svg') || savedLogo.includes('Chaka'))) {
      savedLogo = null;
      localStorage.removeItem('sansad_savedLogo');
    }
    const savedSig = localStorage.getItem('sansad_savedSignature');
    return {
      ...DEFAULT_ORG_DETAILS,
      logoUrl: savedLogo || '/images.jpg',
      signatureUrl: savedSig || DEFAULT_ORG_DETAILS.signatureUrl
    };
  });

  // 3. Donor State
  const [donor, setDonor] = useState<DonorDetails>({
    name: '',
    relationType: 'ପିତା',
    relationName: '',
    address: '',
    gotra: '',
    idType: 'ପ୍ୟାନ୍',
    idNumber: '',
    phone: '',
    email: ''
  });

  // 4. Transaction State
  const [transaction, setTransaction] = useState<TransactionDetails>(() => ({
    receiptNo: `SJS-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    mode: 'ନଗଦ',
    txnId: '',
    selectedAnudan: [],
    selectedDaan: [],
    customSeva: '',
    sevaDate: '',
    showUpiQr: false
  }));

  // 5. History / Registry State
  const [records, setRecords] = useState<ReceiptRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sansad_receipt_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. UI Modals & Notifications
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSignaturePadOpen, setIsSignaturePadOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 7. Preview Zoom & Scaling
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compute responsive auto-scale for A4 container (794px width)
  const [autoScale, setAutoScale] = useState<number>(0.85);

  const updateScale = () => {
    if (previewWrapperRef.current) {
      const containerWidth = previewWrapperRef.current.clientWidth - 48; // padding margin
      const scale = Math.min(1.05, Math.max(0.35, containerWidth / 794));
      setAutoScale(scale);
    }
  };

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isUnlocked]);

  const currentScale = manualZoom !== null ? manualZoom : autoScale;

  // Save to Receipt Register
  const handleSaveToHistory = () => {
    if (!donor.name.trim() && transaction.amount === 0) {
      showToast('⚠️ Please enter donor name or amount before saving.');
      return;
    }

    const newRecord: ReceiptRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      receiptNo: transaction.receiptNo || `SJS-${Date.now().toString().slice(-4)}`,
      date: transaction.date,
      createdAt: new Date().toISOString(),
      donor: { ...donor },
      transaction: { ...transaction },
      totalAmount: transaction.amount
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('sansad_receipt_records', JSON.stringify(updated));
    showToast(`✅ ରସିଦ୍ ${newRecord.receiptNo} ସଫଳତାର ସହିତ ସଞ୍ଚିତ ହେଲା!`);
  };

  // Load Record from History
  const handleLoadRecord = (record: ReceiptRecord) => {
    setDonor({ ...record.donor });
    setTransaction({ ...record.transaction });
    showToast(`📂 Loaded receipt ${record.receiptNo}`);
  };

  // Delete Record from History
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    localStorage.setItem('sansad_receipt_records', JSON.stringify(updated));
    showToast('Record deleted.');
  };

  // Clear All Records
  const handleClearAllRecords = () => {
    setRecords([]);
    localStorage.removeItem('sansad_receipt_records');
    showToast('All records cleared.');
  };

  // High Resolution PDF Generation via html2canvas & jspdf
  const handleGeneratePdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);

    try {
      // Create offscreen clone with unscaled 794x1123 dimensions
      const original = receiptRef.current;
      const clone = original.cloneNode(true) as HTMLElement;

      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.transform = 'none';
      clone.style.width = '794px';
      clone.style.height = '1123px';
      clone.style.margin = '0';
      clone.style.zIndex = '-1000';

      document.body.appendChild(clone);
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(clone, {
        scale: 2, // 2x high resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      const fileName = `${transaction.receiptNo || 'Receipt'}_Donation.pdf`;
      pdf.save(fileName);

      // Auto save to history
      handleSaveToHistory();
      showToast(`📄 PDF ଡାଉନଲୋଡ୍ ସମ୍ପୂର୍ଣ୍ଣ: ${fileName}`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('❌ Failed to generate PDF. You can also use the Direct Print button.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Direct Print handler
  const handleDirectPrint = () => {
    window.print();
  };

  // Fill Sample Data
  const handleFillSample = () => {
    setDonor(SAMPLE_DONOR);
    setTransaction(SAMPLE_TRANSACTION);
    showToast('✨ Sample devotee data filled for Sri Jagannath Sansad!');
  };

  // Reset form to blank new receipt
  const handleNewReceipt = () => {
    setDonor({
      name: '',
      relationType: 'ପିତା',
      relationName: '',
      address: '',
      gotra: '',
      idType: 'ପ୍ୟାନ୍',
      idNumber: '',
      phone: '',
      email: ''
    });
    setTransaction({
      receiptNo: `SJS-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      mode: 'ନଗଦ',
      txnId: '',
      selectedAnudan: [],
      selectedDaan: [],
      customSeva: '',
      sevaDate: '',
      showUpiQr: false
    });
    showToast('✨ New blank receipt created.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      
      {/* Password Overlay Modal */}
      <PasswordModal
        isOpen={!isUnlocked}
        onSuccess={() => setIsUnlocked(true)}
      />

      {/* Signature Pad Modal */}
      <SignaturePadModal
        isOpen={isSignaturePadOpen}
        onClose={() => setIsSignaturePadOpen(false)}
        onSave={(dataUrl) => {
          setOrg((prev) => ({ ...prev, signatureUrl: dataUrl }));
          localStorage.setItem('sansad_savedSignature', dataUrl);
          showToast('✍️ Signature saved.');
        }}
      />

      {/* History Register Modal */}
      <ReceiptHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={records}
        onLoadRecord={handleLoadRecord}
        onDeleteRecord={handleDeleteRecord}
        onClearAll={handleClearAllRecords}
      />

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        donor={donor}
        transaction={transaction}
        org={org}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP APPLICATION BAR */}
      <header className="bg-gradient-to-r from-orange-700 via-orange-800 to-amber-900 text-white shadow-md z-30 no-print">
        <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-orange-300">
              <img
                src={org.logoUrl || '/images.jpg'}
                alt="Emblem"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-black text-lg md:text-xl tracking-tight leading-tight">
                ଶ୍ରୀ ଜଗନ୍ନାଥ ସଂସଦ ରସିଦ୍ ବହି
              </h1>
              <p className="text-[11px] text-orange-200 font-semibold tracking-wider uppercase">
                Official Donation Receipt & Invoice Maker • Garoi Ashram
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewReceipt}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
              title="Start a new blank receipt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ନୂଆ ରସିଦ୍ (New)</span>
            </button>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-white/20 relative"
              title="Open receipts registry and collection stats"
            >
              <History className="w-3.5 h-3.5 text-orange-200" />
              <span className="hidden sm:inline">ରସିଦ୍ ଖାତା (Records)</span>
              {records.length > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {records.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem('sansad_auth_unlocked');
                setIsUnlocked(false);
              }}
              className="px-2.5 py-1.5 bg-black/20 hover:bg-black/40 text-orange-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
              title="Lock receipt system"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN TWO-COLUMN SPLIT INTERFACE */}
      <main
        className={`flex-1 max-w-[1700px] w-full mx-auto p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden transition-all duration-300 ${
          !isUnlocked ? 'filter blur-sm select-none pointer-events-none' : ''
        }`}
      >
        {/* LEFT COLUMN: RECEIPT FORM (5 cols on wide screens) */}
        <section className="lg:col-span-5 h-[calc(100vh-85px)] overflow-y-auto pr-1 no-print">
          <ReceiptForm
            donor={donor}
            setDonor={setDonor}
            transaction={transaction}
            setTransaction={setTransaction}
            org={org}
            setOrg={setOrg}
            onGeneratePdf={handleGeneratePdf}
            onDirectPrint={handleDirectPrint}
            onSaveToHistory={handleSaveToHistory}
            onOpenSignaturePad={() => setIsSignaturePadOpen(true)}
            onFillSample={handleFillSample}
            onShareWhatsApp={() => setIsWhatsAppOpen(true)}
            isGeneratingPdf={isGeneratingPdf}
          />
        </section>

        {/* RIGHT COLUMN: LIVE A4 RECEIPT PREVIEW (7 cols on wide screens) */}
        <section
          ref={previewWrapperRef}
          className="lg:col-span-7 h-[calc(100vh-85px)] bg-slate-200/80 rounded-2xl border border-slate-300 shadow-inner flex flex-col overflow-hidden relative"
        >
          {/* Preview Toolbar */}
          <div className="bg-slate-100/90 backdrop-blur-sm border-b border-slate-300 px-4 py-2.5 flex items-center justify-between no-print z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-700">
                Live A4 Print Preview
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                (794 × 1123 px standard A4 portrait)
              </span>
            </div>

            {/* Zoom / Scaling Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setManualZoom(Math.max(0.4, (currentScale - 0.1)))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-mono font-bold text-slate-600 w-12 text-center">
                {Math.round(currentScale * 100)}%
              </span>

              <button
                onClick={() => setManualZoom(Math.min(1.3, (currentScale + 0.1)))}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setManualZoom(null)}
                className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 transition ml-1"
                title="Fit to Screen"
              >
                Fit
              </button>

              <button
                onClick={() => setManualZoom(1.0)}
                className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[11px] font-semibold text-slate-700 transition"
                title="100% Real Size"
              >
                100%
              </button>
            </div>
          </div>

          {/* Scaled Preview Viewport */}
          <div className="flex-1 overflow-auto p-4 flex justify-center items-start">
            <div
              style={{
                transform: `scale(${currentScale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="shrink-0 shadow-2xl rounded-sm my-2"
            >
              <ReceiptPreview
                ref={receiptRef}
                donor={donor}
                transaction={transaction}
                org={org}
              />
            </div>
          </div>
        </section>
      </main>

      {/* PRINT-ONLY CONTAINER (ACTIVATED ONLY DURING WINDOW.PRINT) */}
      <div className="print-only-container hidden">
        <ReceiptPreview
          donor={donor}
          transaction={transaction}
          org={org}
          id="print-section"
        />
      </div>

    </div>
  );
}
