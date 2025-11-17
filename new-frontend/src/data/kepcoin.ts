export type KepcoinActivityType = 'earn' | 'spend';

export interface KepcoinActivity {
  id: number;
  title: string;
  description: string;
  type: KepcoinActivityType;
  amount: number;
  timestamp: string;
  tag?: string;
}

export const kepcoinSummary = {
  balance: 1240,
  todayEarnings: 85,
  monthlyEarnings: 640,
  reserved: 120,
};

export const kepcoinActivity: KepcoinActivity[] = [
  {
    id: 1,
    title: 'Challenge reward',
    description: 'Solved "Array Navigator" coding task',
    type: 'earn',
    amount: 120,
    timestamp: 'Today · 09:20',
    tag: 'Algorithms',
  },
  {
    id: 2,
    title: 'Daily streak',
    description: 'Kept your 14-day streak running',
    type: 'earn',
    amount: 45,
    timestamp: 'Today · 07:55',
    tag: 'Streak',
  },
  {
    id: 3,
    title: 'Profile upgrade',
    description: 'Purchased "Nebula" avatar frame',
    type: 'spend',
    amount: 60,
    timestamp: 'Yesterday · 21:40',
    tag: 'Cosmetics',
  },
  {
    id: 4,
    title: 'Mentorship tip',
    description: 'Helped another user debug an issue',
    type: 'earn',
    amount: 70,
    timestamp: 'Yesterday · 18:05',
  },
  {
    id: 5,
    title: 'Practice bundle',
    description: 'Unlocked daily practice booster',
    type: 'spend',
    amount: 35,
    timestamp: 'Mon · 12:18',
    tag: 'Booster',
  },
];
