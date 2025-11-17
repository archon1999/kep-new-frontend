export type DailyTaskStatus = 'completed' | 'in-progress' | 'locked';

export interface DailyTask {
  id: number;
  title: string;
  description: string;
  reward: number;
  status: DailyTaskStatus;
}

export const dailyTasks: DailyTask[] = [
  {
    id: 1,
    title: 'Complete your streak',
    description: 'Finish three focused study sessions to keep your streak alive.',
    reward: 40,
    status: 'completed',
  },
  {
    id: 2,
    title: 'Review flashcards',
    description: 'Revise at least 15 flashcards from your current deck.',
    reward: 25,
    status: 'in-progress',
  },
  {
    id: 3,
    title: 'Share feedback',
    description: 'Leave feedback on one community solution to help others grow.',
    reward: 35,
    status: 'in-progress',
  },
  {
    id: 4,
    title: 'Weekly challenge',
    description: 'Complete a weekly challenge task to unlock the bonus chest.',
    reward: 70,
    status: 'locked',
  },
];
