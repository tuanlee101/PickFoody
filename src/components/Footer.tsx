import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-8 px-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">Trưa Nay Ăn Gì Hoàn Kiếm</span>
          <span aria-hidden="true">·</span>
          <span>Ẩm thực tinh hoa Phố Cổ Hà Nội</span>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <a href="#vong-quay" className="hover:text-slate-900 transition-colors">Vòng Quay</a>
          <a href="#danh-sach-mon" className="hover:text-slate-900 transition-colors">Danh Sách Quán</a>
          <a href="#lich-su" className="hover:text-slate-900 transition-colors">Lịch Sử Chọn</a>
        </div>
      </div>
    </footer>
  );
};
