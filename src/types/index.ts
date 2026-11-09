export type FoodCategory = 'soup' | 'dry' | 'specialty' | 'quick' | 'budget';

export interface FoodItem {
  id: string;
  name: string;
  category: 'soup' | 'dry' | 'specialty' | 'quick';
  categoryLabel: string;
  restaurant: string;
  address: string;
  subArea: 'Phố Cổ' | 'Bờ Hồ' | 'Tràng Thi - Nhà Thờ' | 'Lý Thường Kiệt - Phan Chu Trinh' | 'Chợ Đồng Xuân';
  priceRange: string;
  averagePrice: number; // in thousands (VND) for filtering
  description: string;
  tag: string;
  rating: number;
  openHours: string;
  color: string;
  textColor: string;
  enabled: boolean;
  isCustom?: boolean;
}

export interface HistoryRecord {
  id: string;
  foodId: string;
  foodName: string;
  restaurant: string;
  address: string;
  subArea: string;
  priceRange: string;
  categoryLabel: string;
  chosenAt: string; // ISO string
  spinsCountAtChoice?: number;
}
