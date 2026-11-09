import React from 'react';
import { FoodItem } from '../types';
import { MapPin, Clock, DollarSign, RotateCcw, Check, ExternalLink, X, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface WinnerModalProps {
  winner: FoodItem | null;
  onClose: () => void;
  onConfirmChoice: (item: FoodItem) => void;
  onSpinAgain: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  onClose,
  onConfirmChoice,
  onSpinAgain,
}) => {
  if (!winner) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${winner.restaurant} ${winner.address}`
  )}`;

  const handleConfirm = () => {
    soundFx.playClick();
    onConfirmChoice(winner);
  };

  const handleSpinAgain = () => {
    soundFx.playClick();
    onSpinAgain();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
        {/* Top celebratory decorative banner */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 px-6 py-5 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Kết quả quay thưởng trưa nay</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1 text-white">
            {winner.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-amber-100 mt-1">
            <span>{winner.subArea}</span>
            <span aria-hidden="true">·</span>
            <span>{winner.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-300 font-medium">{winner.tag}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          {/* Restaurant & Location */}
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 text-base flex items-center justify-between">
              <span>{winner.restaurant}</span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                ★ {winner.rating}
              </span>
            </h3>

            <div className="mt-2 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-800">{winner.address}</span>
              </div>
              <div className="flex items-center gap-4 pt-1 text-slate-500">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{winner.priceRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{winner.openHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasty tip / description */}
          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
            <p className="italic text-slate-600">
              &ldquo;{winner.description}&rdquo;
            </p>
          </div>

          {/* Direct Google Maps link */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700 group"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Xem vị trí quán trên Google Maps</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </a>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleSpinAgain}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Quay lại món khác
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              Chốt ăn món này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
