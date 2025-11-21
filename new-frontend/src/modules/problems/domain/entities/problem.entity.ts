export interface ProblemTag {
  id: number;
  name: string;
  category?: string;
}

export interface Problem {
  id: number;
  title: string;
  symbol?: string;
  difficulty?: number;
  difficultyTitle?: string;
  tags?: ProblemTag[];
  solved?: number;
  notSolved?: number;
  attemptsCount?: number;
  authorUsername?: string;
}

export interface ProblemsPageResult<T = Problem> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProblemsRatingRow {
  solved: number;
  rating?: number;
  beginner?: number;
  basic?: number;
  normal?: number;
  medium?: number;
  advanced?: number;
  hard?: number;
  extremal?: number;
  allBeginner?: number;
  allBasic?: number;
  allNormal?: number;
  allMedium?: number;
  allAdvanced?: number;
  allHard?: number;
  allExtremal?: number;
}

export interface ProblemAttempt {
  id: number;
  problemId: number;
  problemTitle: string;
  verdict: string;
  createdAt?: string;
}

export interface LastContest {
  id: number;
  title: string;
  problems: Array<{
    id: number;
    symbol?: string;
    title: string;
  }>;
}
