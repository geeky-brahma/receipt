import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  savedPassword?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onSuccess,
  savedPassword = 'SJS@26'
}) => {
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputVal.trim() === savedPassword) {
      setError(false);
      if (rememberMe) {
        localStorage.setItem('sansad_auth_unlocked', 'true');
      }
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-8 border-orange-600 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-1">
            ଶ୍ରୀ ଜଗନ୍ନାଥ ସଂସଦ ରସିଦ୍ ବହି
          </h2>
          <p className="text-sm font-semibold text-orange-700 mb-2">
            SRI JAGANNATH SANSAD - RECEIPT SYSTEM
          </p>
          <p className="text-sm text-slate-500 mb-6">
            ଦୟାକରି ସଠିକ୍ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ (Enter authorization password)
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setError(false);
                }}
                className={`w-full px-4 py-3.5 pr-11 border-2 rounded-xl text-center text-lg font-bold tracking-wider transition outline-none ${
                  error
                    ? 'border-red-500 bg-red-50/50 text-red-900 focus:border-red-600'
                    : 'border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100'
                }`}
                placeholder="ପାସୱାର୍ଡ ଭରନ୍ତୁ"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 animate-shake">
                <span>❌ ଭୁଲ୍ ପାସୱାର୍ଡ! (Incorrect Password)</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                />
                <span>ମନେ ରଖନ୍ତୁ (Remember this device)</span>
              </label>

              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>ସଙ୍କେତ (Hint)</span>
              </button>
            </div>

            {showHint && (
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 text-left">
                Default password: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300">SJS@26</strong>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl hover:from-orange-700 hover:to-orange-800 shadow-lg shadow-orange-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>ଲଗ୍ଇନ୍ କରନ୍ତୁ (Unlock Receipt Book)</span>
            </button>
          </form>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 text-center text-xs text-slate-400">
          Garoi Ashram, Jagatsinghpur, Odisha • Official Portal
        </div>
      </div>
    </div>
  );
};
