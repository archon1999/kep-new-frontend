import {
  UserKepcoinEarn,
  UserKepcoinEarnEarnType,
  UserKepcoinSpend,
  UserKepcoinSpendType,
} from 'shared/api/orval/generated/endpoints/index.schemas';

export type KepcoinView = 'earns' | 'spends';

export interface KepcoinStreak {
  streak: number;
  streakFreeze: number;
}

export type KepcoinEarnEntry = UserKepcoinEarn;

export type KepcoinSpendEntry = UserKepcoinSpend;

export type KepcoinEarnType = UserKepcoinEarnEarnType;
export type KepcoinSpendType = UserKepcoinSpendType;
