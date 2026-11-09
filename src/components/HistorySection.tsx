import React, { useState } from 'react';
import { HistoryRecord } from '../types';
import { History, Trash2, MapPin, Calendar, Utensils, Share2, Check } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HistorySectionProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onSelectRecord?: (record: HistoryRecord) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onClearHistory,
  onDeleteRecord,
  onSelectRecord,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      const timeStr = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (isToday) {
        return `Hôm nay, ${timeStr}`;
      }

      return `${date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      })}, ${timeStr}`;
    } catch {
      return isoString;
    }
  };

  const handleShareSummary = () => {
    soundFx.playClick();
    if (history.length === 0) return;

    const summaryText = [
      '🍜 Lịch sử chọn món ăn trưa Hoàn Kiếm:',
      ...history.slice(0, 5).map(
        (item, index) =>
          `${index + 1}. ${item.foodName} (${item.restaurant}) - ${formatDate(item.chosenAt)}`
      ),
      '',
      'Được quay từ: Trưa Nay Ăn Gì Hoàn Kiếm',
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Find most frequent food item
  const foodCounts = history.reduce<Record<string, number>>((acc, item) => {
    acc[item.foodName] = (acc[item.foodName] || 0) + 1;
    return acc;
  }, {});

  const mostFrequent = Object.entries(foodCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm md:text-base">
              Lịch Sử Chọn Món
            </h3>
            <p className="text-xs text-slate-500">
              Đã quay và lưu lại {history.length} lần chọn món
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareSummary}
              title="Sao chép tóm tắt lịch sử"
              className="p-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-600">Đã chép</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sao chép</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chọn món?')) {
                  soundFx.playClick();
                  onClearHistory();
                }
              }}
              title="Xóa toàn bộ lịch sử"
              className="p-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xóa lịch sử</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick stats strip */}
      {history.length > 0 && mostFrequent && (
        <div className="grid grid-cols-2 gap-3 bg-amber-50/60 rounded-xl p-3 border border-amber-100 text-xs">
          <div>
            <span className="text-slate-500 block">Tổng số lần quay:</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {history.length} lượt chọn
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Món trúng nhiều nhất:</span>
            <span className="font-semibold text-red-700 truncate block">
              {mostFrequent[0]} ({mostFrequent[1]} lần)
            </span>
          </div>
        </div>
      )}

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="text-center py-8 px-4 text-slate-400 space-y-2">
          <Utensils className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
          <p className="text-xs text-slate-500">Chưa có lịch sử chọn món nào</p>
          <p className="text-[11px] text-slate-400">
            Hãy bấm nút quay vòng quay may mắn để quyết định bữa trưa của bạn!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {history.map((record) => (
            <div
              key={record.id}
              className="group p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-amber-200 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 truncate text-sm">
                    {record.foodName}
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    · {record.categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 text-[11px] truncate">
                  <span className="font-medium text-slate-800 shrink-0">
                    {record.restaurant}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate text-slate-500">{record.address}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(record.chosenAt)}</span>
                  </div>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium tabular-nums">
                    {record.priceRange}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${record.restaurant} ${record.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Xem chỉ đường trên Google Maps"
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onDeleteRecord(record.id);
                  }}
                  title="Xóa mục này"
                  className="p-1.5 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
