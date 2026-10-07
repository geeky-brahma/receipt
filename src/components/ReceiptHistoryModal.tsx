import React, { useState } from 'react';
import { ReceiptRecord } from '../types/receipt';
import { formatINR, formatIndianDate } from '../utils/numberToWords';
import {
  X,
  Search,
  Download,
  Trash2,
  Eye,
  FileSpreadsheet,
  Receipt,
  Calendar,
  IndianRupee
} from 'lucide-react';

interface ReceiptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ReceiptRecord[];
  onLoadRecord: (record: ReceiptRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const ReceiptHistoryModal: React.FC<ReceiptHistoryModalProps> = ({
  isOpen,
  onClose,
  records,
  onLoadRecord,
  onDeleteRecord,
  onClearAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = records.filter((rec) => {
    const q = searchTerm.toLowerCase();
    return (
      rec.receiptNo.toLowerCase().includes(q) ||
      rec.donor.name.toLowerCase().includes(q) ||
      rec.donor.phone.includes(q) ||
      rec.transaction.mode.toLowerCase().includes(q)
    );
  });

  const totalAmount = records.reduce((sum, r) => sum + r.totalAmount, 0);

  // Export to CSV for accountant / management
  const exportToCsv = () => {
    if (records.length === 0) return;

    const headers = [
      'Receipt No',
      'Date',
      'Donor Name',
      'Relation',
      'Address',
      'Gotra',
      'ID Type',
      'ID Number',
      'Phone',
      'Email',
      'Amount (INR)',
      'Payment Mode',
      'Txn ID',
      'Anudan (Dhupa)',
      'Daan (Purpose)',
      'Designated Date'
    ];

    const rows = records.map((r) => [
      `"${r.receiptNo}"`,
      `"${r.date}"`,
      `"${r.donor.name.replace(/"/g, '""')}"`,
      `"${r.donor.relationType}: ${r.donor.relationName.replace(/"/g, '""')}"`,
      `"${r.donor.address.replace(/"/g, '""')}"`,
      `"${r.donor.gotra.replace(/"/g, '""')}"`,
      `"${r.donor.idType}"`,
      `"${r.donor.idNumber}"`,
      `"${r.donor.phone}"`,
      `"${r.donor.email}"`,
      r.totalAmount,
      `"${r.transaction.mode}"`,
      `"${r.transaction.txnId.replace(/"/g, '""')}"`,
      `"${r.transaction.selectedAnudan.join(', ')}"`,
      `"${r.transaction.selectedDaan.join(', ')}"`,
      `"${r.transaction.sevaDate.replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SJS_Donation_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-orange-700 to-orange-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Receipt className="w-6 h-6 text-orange-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl">
                ରସିଦ୍ ଖାତା (Receipt Register & Records)
              </h3>
              <p className="text-xs text-orange-200">
                All saved donation receipts stored securely in local database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Cards Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Receipts
            </span>
            <span className="text-2xl font-black text-slate-800">
              {records.length}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Collection
            </span>
            <span className="text-2xl font-black text-green-700">
              {formatINR(totalAmount)}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-2">
            <button
              onClick={exportToCsv}
              disabled={records.length === 0}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV (Excel)</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by receipt number, donor name, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          {records.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all saved receipt records?')) {
                  onClearAll();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-2 border border-red-200 hover:bg-red-50 rounded-xl transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Receipts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Receipt className="w-12 h-12 mx-auto stroke-[1.5] text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No receipt records found</p>
              <p className="text-xs text-slate-400 mt-1">
                Generate or save receipts from the main screen to keep records here.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-orange-300 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-orange-900 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-xs">
                      {item.receiptNo}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatIndianDate(item.date)}
                    </span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {item.transaction.mode}
                    </span>
                  </div>

                  <p className="font-bold text-slate-900 text-sm">
                    {item.donor.name || 'Anonymous Donor'}
                  </p>

                  <p className="text-xs text-slate-500">
                    {item.donor.phone ? `Ph: ${item.donor.phone} • ` : ''}
                    {item.donor.address ? item.donor.address.substring(0, 45) + '...' : ''}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium block">Amount</span>
                    <span className="text-lg font-black text-green-700">
                      {formatINR(item.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onLoadRecord(item);
                        onClose();
                      }}
                      className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded-lg transition"
                      title="Load into Preview and Form"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
