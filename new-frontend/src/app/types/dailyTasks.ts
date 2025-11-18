export enum DailyTaskType {
  Problem = 1,
  Test,
  Challenge,
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
