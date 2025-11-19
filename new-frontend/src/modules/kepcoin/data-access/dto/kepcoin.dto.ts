import { EarnType, SpendType } from '../../domain/entities/kepcoin.entity';

export interface ApiKepcoinEarn {
  id?: number | string;
  kepcoin: number;
  datetime: string;
  earnType: EarnType;
  detail?: Record<string, any> | null;
}

export interface ApiKepcoinSpend {
  id?: number | string;
  kepcoin: number;
  datetime: string;
  type: SpendType;
  detail?: Record<string, any> | null;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface ApiStreakResponse {
  streak: number;
  streakFreeze: number;
  maxStreak?: number;
}

export interface ApiPurchaseResponse {
  success?: boolean;
  message?: string;
}
