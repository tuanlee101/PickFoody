import React from 'react';
import { CATEGORY_FILTERS, HOAN_KIEM_SUB_AREAS } from '../data/foodData';
import { soundFx } from '../utils/audio';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  activeCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedArea,
  onSelectArea,
  activeCount,
  totalCount,
}) => {
  return (
    <div className="space-y-3">
      {/* Category Segmented Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectCategory(cat.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sub-area filter dropdown */}
        <div className="flex items-center gap-2 px-2 py-1">
          <label htmlFor="area-select" className="text-xs text-slate-500 whitespace-nowrap">
            Khu vực:
          </label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={(e) => {
              soundFx.playClick();
              onSelectArea(e.target.value);
            }}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-red-500"
          >
            {HOAN_KIEM_SUB_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metadata status bar (clean unboxed text per Section 1.A) */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span>Vòng quay hiện tại</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-900">{activeCount} món đang sẵn sàng</span>
          <span aria-hidden="true">·</span>
          <span>Khu vực Hoàn Kiếm, Hà Nội</span>
        </div>
      </div>
    </div>
  );
};
