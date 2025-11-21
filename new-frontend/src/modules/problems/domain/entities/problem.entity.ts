export interface ProblemTag {
  id: number;
  name: string;
}

export interface ProblemUserInfo {
  hasAttempted?: boolean;
  hasSolved?: boolean;
  voteType?: number | null;
  isFavorite?: boolean;
  canViewSolution?: boolean;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle?: string;
  solved: number;
  attemptsCount: number;
  likesCount: number;
  dislikesCount: number;
  hasSolution?: boolean;
  hasChecker?: boolean;
  hidden?: boolean;
  tags: ProblemTag[];
  userInfo?: ProblemUserInfo;
}
