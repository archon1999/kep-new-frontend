export interface ProblemTag {
  id?: number;
  name: string;
  category?: string;
}

export interface ProblemTopic {
  id?: number;
  name: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle: string;
  solvedCount: number;
  attemptsCount: number;
  likesCount?: number;
  dislikesCount?: number;
  hasSolution?: boolean;
  hasChecker?: boolean;
  tags: ProblemTag[];
  topics?: ProblemTopic[];
  authorUsername?: string;
}

export interface ProblemsPageFilters {
  search?: string;
  difficulty?: number;
  status?: number;
  ordering?: string;
  tags?: number[];
  hasSolution?: boolean;
  hasChecker?: boolean;
  favorites?: boolean;
}

export const difficultyLabels: Record<number, string> = {
  0: 'common.allLevels',
  1: 'problems.difficulty.beginner',
  2: 'problems.difficulty.basic',
  3: 'problems.difficulty.normal',
  4: 'problems.difficulty.medium',
  5: 'problems.difficulty.advanced',
  6: 'problems.difficulty.hard',
  7: 'problems.difficulty.extremal',
};

export const difficultyColors: Record<number, 'success' | 'primary' | 'info' | 'warning' | 'secondary' | 'error'> = {
  1: 'success',
  2: 'primary',
  3: 'info',
  4: 'warning',
  5: 'secondary',
  6: 'error',
  7: 'error',
};
