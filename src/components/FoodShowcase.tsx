import React from 'react';
import { FoodItem } from '../types';
import { MapPin, DollarSign, Clock, ExternalLink, Star } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface FoodShowcaseProps {
  items: FoodItem[];
  onSelectForWheel?: (item: FoodItem) => void;
}

export const FoodShowcase: React.FC<FoodShowcaseProps> = ({ items }) => {
  return (
    <section id="danh-sach-mon" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Địa Chỉ Quán Ngon Trưa Hoàn Kiếm
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Các quán ăn trưa nức tiếng phố cổ được dân văn phòng và sành ăn thủ đô lựa chọn
          </p>
        </div>
        <span className="text-xs text-slate-400">
          Hiển thị {items.length} món ăn được kích hoạt
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${item.restaurant} ${item.address}`
          )}`;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                {/* Header row with color badge & tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-slate-500">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Dish name & restaurant */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {item.restaurant}
                  </p>
                </div>

                {/* Unboxed metadata per Section 1.A */}
                <div className="text-xs text-slate-500 flex items-center gap-2 pt-0.5">
                  <span>{item.subArea}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium tabular-nums">{item.priceRange}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.tag}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">
                  {item.description}
                </p>
              </div>

              {/* Address and map link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{item.address}</span>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="text-slate-600 hover:text-red-600 p-1 rounded transition-colors shrink-0"
                  title="Mở chỉ đường Google Maps"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
