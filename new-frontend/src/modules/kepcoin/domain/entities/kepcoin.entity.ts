export interface KepcoinBalance {
  value: number;
}

export interface KepcoinDetail {
  [key: string]: unknown;
}

export interface KepcoinEarn {
  amount: number;
  type: number;
  datetime?: string;
  detail?: KepcoinDetail;
  note?: string;
}

export interface KepcoinSpend {
  amount: number;
  type: number;
  datetime?: string;
  detail?: KepcoinDetail;
  note?: string;
}

export interface KepcoinListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pagesCount: number;
}

export interface StreakInfo {
  streak?: number;
  streakFreeze?: number;
}
