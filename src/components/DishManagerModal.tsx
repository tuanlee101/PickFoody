import React, { useState } from 'react';
import { FoodItem } from '../types';
import { X, Plus, RotateCcw, CheckSquare, Square, Search, Trash2, MapPin } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface DishManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: FoodItem[];
  onToggleItem: (id: string) => void;
  onToggleAll: (enabled: boolean) => void;
  onAddItem: (newItem: Partial<FoodItem>) => void;
  onDeleteItem: (id: string) => void;
  onResetDefaults: () => void;
}

export const DishManagerModal: React.FC<DishManagerModalProps> = ({
  isOpen,
  onClose,
  items,
  onToggleItem,
  onToggleAll,
  onAddItem,
  onDeleteItem,
  onResetDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRestaurant, setNewRestaurant] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState('50.000đ - 70.000đ');
  const [newCategory, setNewCategory] = useState<'soup' | 'dry' | 'specialty' | 'quick'>('dry');

  if (!isOpen) return null;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = items.filter((i) => i.enabled).length;

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRestaurant.trim()) return;

    soundFx.playClick();
    onAddItem({
      name: newName.trim(),
      restaurant: newRestaurant.trim(),
      address: newAddress.trim() || 'Khu vực Hoàn Kiếm, Hà Nội',
      priceRange: newPrice.trim(),
      category: newCategory,
      categoryLabel:
        newCategory === 'soup'
          ? 'Món nước'
          : newCategory === 'specialty'
          ? 'Đặc sản Phố Cổ'
          : newCategory === 'quick'
          ? 'Ăn nhanh'
          : 'Món khô & Cơm',
      subArea: 'Phố Cổ',
      description: 'Món ăn do bạn thêm vào danh sách yêu thích.',
      tag: 'Tùy chỉnh',
      rating: 5.0,
      openHours: '10:00 - 14:00',
      color: '#EA580C',
      textColor: '#FFFFFF',
      enabled: true,
      isCustom: true,
    });

    setNewName('');
    setNewRestaurant('');
    setNewAddress('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Tùy Chỉnh Danh Sách Món Ăn
            </h2>
            <p className="text-xs text-slate-500">
              Bật/tắt món hôm nay bạn không muốn ăn hoặc thêm quán quen quanh Hoàn Kiếm (Đang bật{' '}
              <span className="font-semibold text-red-600">{activeCount}/{items.length}</span> món)
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Search Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm món, quán hoặc phố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onToggleAll(activeCount < items.length);
                }}
                className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {activeCount === items.length ? (
                  <>
                    <Square className="w-3.5 h-3.5 text-slate-500" />
                    <span>Bỏ chọn tất cả</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-red-600" />
                    <span>Chọn tất cả</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowAddForm(!showAddForm);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm quán</span>
              </button>
            </div>
          </div>

          {/* Add custom dish form */}
          {showAddForm && (
            <form
              onSubmit={handleAddNewItem}
              className="p-3 bg-white border border-red-200 rounded-xl space-y-2.5 text-xs animate-in slide-in-from-top-2 duration-150"
            >
              <h4 className="font-semibold text-slate-900">
                Thêm món / quán mới quanh Hoàn Kiếm:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tên món (vd: Phở Gà Trộn, Cơm Tấm)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  placeholder="Tên quán (vd: Phở Gà Châm Yên Ninh)"
                  value={newRestaurant}
                  onChange={(e) => setNewRestaurant(e.target.value)}
                  required
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ (vd: 64 Yên Ninh, Hoàn Kiếm)"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mức giá (vd: 45.000đ - 65.000đ)"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
                  />
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as 'soup' | 'dry' | 'specialty' | 'quick'
                      )
                    }
                    className="px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="soup">Món nước</option>
                    <option value="dry">Món khô</option>
                    <option value="specialty">Đặc sản</option>
                    <option value="quick">Ăn nhanh</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Lưu & Thêm vào vòng quay
                </button>
              </div>
            </form>
          )}
        </div>

        {/* List of Dishes with Checkboxes */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                item.enabled
                  ? 'bg-white border-slate-200 hover:border-amber-400'
                  : 'bg-slate-50/70 border-slate-100 opacity-55'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => {}} // Controlled by outer div click
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                />
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        item.enabled ? 'text-slate-900' : 'text-slate-400 line-through'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      · {item.categoryLabel}
                    </span>
                    {item.isCustom && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                        Tự thêm
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] truncate mt-0.5">
                    <span className="font-medium text-slate-700">{item.restaurant}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-medium text-emerald-700 tabular-nums">
                  {item.priceRange}
                </span>

                {item.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playClick();
                      onDeleteItem(item.id);
                    }}
                    title="Xóa món tự thêm này"
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <p className="text-center py-6 text-xs text-slate-400">
              Không tìm thấy món nào phù hợp với từ khóa
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục danh sách món ăn mặc định của Phố Cổ Hoàn Kiếm?')) {
                soundFx.playClick();
                onResetDefaults();
              }
            }}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition-colors"
          >
            Xong ({activeCount} món sẵn sàng)
          </button>
        </div>
      </div>
    </div>
  );
};
