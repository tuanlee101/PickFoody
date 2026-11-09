import React from 'react';
import { Compass, Info, Bike, Clock3 } from 'lucide-react';

export const AreaGuide: React.FC = () => {
  return (
    <section id="khu-vuc" className="bg-amber-50/50 rounded-2xl border border-amber-200/60 p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Cẩm Nang Ăn Trưa Quanh Hồ Hoàn Kiếm
          </h2>
          <p className="text-xs text-slate-600">
            Gợi ý chọn quán phù hợp với thời gian nghỉ trưa và nhóm đồng nghiệp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>Khu Phố Cổ & Chợ Đồng Xuân</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tập trung các món nước gia truyền lâu đời nhất: Phở Bát Đàn, Bún Chả Hàng Quạt, Cơm rang Mã Mây. Thích hợp đi bộ thong thả theo nhóm nhỏ 2-4 người.
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            <span>Giờ đông nhất: 11:45 - 12:30</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Khu Bờ Hồ & Tràng Tiền - Nhà Thờ</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhiều ngõ ẩm thực trứ danh như ngõ Tràng Tiền (bún đậu mắm tôm, bún cá), Bánh Mì 25, Bún Thang Cầu Gỗ. Thuận tiện ăn xong ghé cà phê trứng hoặc dạo mát ven hồ.
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            <span>Gợi ý: Đi xe máy hoặc tản bộ</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Khu Tràng Thi & Phan Chu Trinh</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Khu vực văn phòng trung tâm với cơm niêu, cơm tấm, bún riêu cua bắp bò phục vụ nhanh, chỗ ngồi rộng rãi có máy lạnh, nhận đặt bàn nhóm đông người.
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            <span>Tiện ích: Có chỗ gửi xe máy rộng</span>
          </div>
        </div>
      </div>

      {/* Quick Office Tips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-amber-100">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Mẹo trưa: Nên xuất phát từ công ty trước 11:45 để có chỗ ngồi thoáng mát tại các quán nổi tiếng.</span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 shrink-0">
          <span className="flex items-center gap-1">
            <Clock3 className="w-3.5 h-3.5" /> Nghỉ trưa 1h-1.5h
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" /> Bán kính &lt;1.5km
          </span>
        </div>
      </div>
    </section>
  );
};
