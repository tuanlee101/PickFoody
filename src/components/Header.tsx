import React, { useState } from 'react';
import { SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  onOpenDishManager: () => void;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDishManager,
  activeCount,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playClick();
    }
  };

  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-amber-900/10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="/"
        className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
        <span>Trưa Nay Hoàn Kiếm</span>
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
        <a
          href="#vong-quay"
          className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Vòng Quay
        </a>
        <a
          href="#danh-sach-mon"
          className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Món Phố Cổ
        </a>
        <a
          href="#lich-su"
          className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Lịch Sử Chọn
        </a>
        <a
          href="#khu-vuc"
          className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
        >
          Bản Đồ Quán
        </a>
      </nav>

      {/* Zone 3: 1 primary action + audio control */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Bật âm thanh quay' : 'Tắt âm thanh'}
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-600" />
          )}
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onOpenDishManager();
          }}
          className="px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Tùy Chọn ({activeCount})</span>
        </button>
      </div>
    </header>
  );
};
