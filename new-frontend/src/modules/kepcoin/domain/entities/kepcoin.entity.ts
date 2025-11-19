export interface KepcoinSummary {
  balance: number;
  streak: number;
  streakFreeze: number;
}

export type KepcoinTransactionType = 'earn' | 'spend';

export interface KepcoinTransaction {
  id: string;
  amount: number;
  datetime: string;
  title: string;
  description?: string;
  type: KepcoinTransactionType;
}

export interface KepcoinGuideItem {
  id: string;
  value: string;
  labelKey: string;
}

export interface KepcoinPageContent {
  summary: KepcoinSummary;
  transactions: {
    earns: KepcoinTransaction[];
    spends: KepcoinTransaction[];
  };
  guides: {
    earn: KepcoinGuideItem[];
    spend: KepcoinGuideItem[];
  };
}
