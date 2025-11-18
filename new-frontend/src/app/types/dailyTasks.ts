export enum DailyTaskType {
  Problem = 1,
  Test = 2,
  Challenge = 3,
}

export interface DailyTask {
  type: DailyTaskType;
  kepcoin: number;
  progress: number;
  total: number;
  completed: boolean;
  description: string;
}

export interface DailyTasksResponse {
  streak: number;
  maxStreak: number;
  dailyTasks: DailyTask[];
}
