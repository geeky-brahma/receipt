import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, X } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a'; // dark navy / black ink
      }
      setHasContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasContent(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasContent(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-800">ସ୍ଵାକ୍ଷର ଆଙ୍କନ୍ତୁ (Draw Digital Signature)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-2 flex flex-col items-center">
            <canvas
              ref={canvasRef}
              width={420}
              height={160}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="bg-white rounded-lg shadow-inner cursor-crosshair touch-none w-full max-w-[420px] h-[160px]"
            />
            <p className="text-xs text-slate-400 mt-2">
              Sign above using mouse or touch • ମାଉସ୍ କିମ୍ବା ଟଚ୍ ସାହାଯ୍ୟରେ ସ୍ଵାକ୍ଷର କରନ୍ତୁ
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={clearCanvas}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-100 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ପୁନଃ ଆରମ୍ଭ (Clear)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 text-sm font-semibold hover:bg-slate-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!hasContent}
              onClick={handleSave}
              className="px-5 py-2 bg-orange-600 text-white text-sm font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-1.5 shadow transition"
            >
              <Check className="w-4 h-4" />
              <span>ରଖନ୍ତୁ (Apply Signature)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
