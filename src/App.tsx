import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FoodItem, HistoryRecord } from './types';
import { INITIAL_FOOD_ITEMS } from './data/foodData';
import { Header } from './components/Header';
import { Wheel } from './components/Wheel';
import { WinnerModal } from './components/WinnerModal';
import { HistorySection } from './components/HistorySection';
import { DishManagerModal } from './components/DishManagerModal';
import { FilterBar } from './components/FilterBar';
import { FoodShowcase } from './components/FoodShowcase';
import { AreaGuide } from './components/AreaGuide';
import { Footer } from './components/Footer';
import { launchConfetti } from './utils/confetti';
import { soundFx } from './utils/audio';
import { Sparkles, SlidersHorizontal, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY_ITEMS = 'hoankiem_food_items_v1';
const STORAGE_KEY_HISTORY = 'hoankiem_lunch_history_v1';

export default function App() {
  // Load saved items or use initial data
  const [items, setItems] = useState<FoodItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to default
      }
    }
    return INITIAL_FOOD_ITEMS;
  });

  // Load saved history
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        // Fallback
      }
    }
    return [];
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('Tất cả khu vực');

  // Interactive States
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winnerModalItem, setWinnerModalItem] = useState<FoodItem | null>(null);
  const [isDishManagerOpen, setIsDishManagerOpen] = useState<boolean>(false);
  const [lastConfirmedFood, setLastConfirmedFood] = useState<FoodItem | null>(null);

  // Sync items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Determine active items on the wheel based on enabled status and active filters
  const activeWheelItems = useMemo(() => {
    let filtered = items.filter((item) => item.enabled);

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'quick') {
        filtered = filtered.filter((i) => i.category === 'quick' || i.averagePrice <= 50);
      } else {
        filtered = filtered.filter((i) => i.category === selectedCategory);
      }
    }

    if (selectedArea !== 'Tất cả khu vực') {
      filtered = filtered.filter((i) => i.subArea === selectedArea);
    }

    // Safety fallback: If filter leaves fewer than 2 items, fallback to all enabled items
    if (filtered.length < 2) {
      return items.filter((i) => i.enabled);
    }

    return filtered;
  }, [items, selectedCategory, selectedArea]);

  // Spin start callback
  const handleSpinStart = useCallback(() => {
    setIsSpinning(true);
    setWinnerModalItem(null);
  }, []);

  // Spin end callback
  const handleSpinEnd = useCallback((winner: FoodItem) => {
    setIsSpinning(false);
    setWinnerModalItem(winner);
    launchConfetti();
  }, []);

  // Confirm choice and save to history
  const handleConfirmChoice = (item: FoodItem) => {
    const newRecord: HistoryRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      foodId: item.id,
      foodName: item.name,
      restaurant: item.restaurant,
      address: item.address,
      subArea: item.subArea,
      priceRange: item.priceRange,
      categoryLabel: item.categoryLabel,
      chosenAt: new Date().toISOString(),
    };

    setHistory((prev) => [newRecord, ...prev]);
    setLastConfirmedFood(item);
    setWinnerModalItem(null);
  };

  // Re-spin from modal
  const handleSpinAgain = () => {
    setWinnerModalItem(null);
  };

  // History controls
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // Ignore
    }
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  // Item customization controls
  const handleToggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleToggleAll = (enabled: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, enabled })));
  };

  const handleAddItem = (newItem: Partial<FoodItem>) => {
    const itemToAdd: FoodItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name || 'Món mới',
      category: newItem.category || 'dry',
      categoryLabel: newItem.categoryLabel || 'Món khô & Cơm',
      restaurant: newItem.restaurant || 'Quán ăn Hoàn Kiếm',
      address: newItem.address || 'Quận Hoàn Kiếm, Hà Nội',
      subArea: newItem.subArea || 'Phố Cổ',
      priceRange: newItem.priceRange || '40.000đ - 60.000đ',
      averagePrice: 50,
      description: newItem.description || 'Món ăn tùy chỉnh theo sở thích riêng.',
      tag: 'Tự thêm',
      rating: 5.0,
      openHours: '10:00 - 14:00',
      color: '#EA580C',
      textColor: '#FFFFFF',
      enabled: true,
      isCustom: true,
    };

    setItems((prev) => [itemToAdd, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetDefaults = () => {
    setItems(INITIAL_FOOD_ITEMS);
    setSelectedCategory('all');
    setSelectedArea('Tất cả khu vực');
  };

  const totalEnabled = items.filter((i) => i.enabled).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        onOpenDishManager={() => setIsDishManagerOpen(true)}
        activeCount={totalEnabled}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {/* Hero Section */}
        <div id="vong-quay" className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/70 border border-amber-200/60 rounded-full text-xs font-semibold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tinh hoa ẩm thực 36 phố phường Hà Nội</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Trưa Nay Ăn Gì Quanh Bờ Hồ & Phố Cổ?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hết đau đầu suy nghĩ bữa trưa cùng đồng nghiệp! Quay bánh xe may mắn với các quán ăn trứ danh quận Hoàn Kiếm, chuẩn vị và lưu lại lịch sử chọn món.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedArea={selectedArea}
          onSelectArea={setSelectedArea}
          activeCount={activeWheelItems.length}
          totalCount={items.length}
        />

        {/* Notice if filter has fallback */}
        {activeWheelItems.length < 2 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Bộ lọc hiện tại có quá ít món. Vui lòng bật thêm món trong menu tùy chỉnh để quay bánh xe!
            </span>
          </div>
        )}

        {/* Central Wheel & History Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Wheel (Col 1 - 7) */}
          <div className="lg:col-span-7 flex flex-col items-center bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
            {/* Subtle background ring decoration */}
            <div className="absolute w-96 h-96 rounded-full bg-amber-50/60 -top-20 -left-20 blur-3xl pointer-events-none" />

            {/* Quick Status Pill */}
            <div className="flex items-center justify-between w-full mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{activeWheelItems.length} món trên vòng quay</span>
                <span aria-hidden="true">·</span>
                <span>Tỉ lệ trúng đều nhau</span>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsDishManagerOpen(true);
                }}
                className="text-xs font-medium text-slate-600 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Chỉnh món</span>
              </button>
            </div>

            {/* Interactive Canvas Wheel */}
            <Wheel
              items={activeWheelItems}
              isSpinning={isSpinning}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
            />

            {/* Bottom Actions for Wheel */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundFx.playClick();
                  handleResetDefaults();
                }}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đặt lại danh sách gốc</span>
              </button>
            </div>
          </div>

          {/* Right Column: History Section & Last Choice (Col 8 - 12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Recent Confirmed Choice Card if any */}
            {lastConfirmedFood && (
              <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                    Đã chốt hôm nay
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Vừa xong
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {lastConfirmedFood.name}
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    {lastConfirmedFood.restaurant} - {lastConfirmedFood.address}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${lastConfirmedFood.restaurant} ${lastConfirmedFood.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Mở bản đồ chỉ đường</span>
                  </a>
                </div>
              </div>
            )}

            {/* History List */}
            <div id="lich-su">
              <HistorySection
                history={history}
                onClearHistory={handleClearHistory}
                onDeleteRecord={handleDeleteRecord}
              />
            </div>
          </div>
        </div>

        {/* Food Showcase Grid */}
        <FoodShowcase items={activeWheelItems} />

        {/* Area Guide Section */}
        <AreaGuide />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <WinnerModal
        winner={winnerModalItem}
        onClose={() => setWinnerModalItem(null)}
        onConfirmChoice={handleConfirmChoice}
        onSpinAgain={handleSpinAgain}
      />

      <DishManagerModal
        isOpen={isDishManagerOpen}
        onClose={() => setIsDishManagerOpen(false)}
        items={items}
        onToggleItem={handleToggleItem}
        onToggleAll={handleToggleAll}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
