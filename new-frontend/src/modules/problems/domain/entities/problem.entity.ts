export interface ProblemTag {
  id: number;
  name: string;
  category?: string;
}

export interface ProblemListItem {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle?: string;
  solved?: number;
  attemptsCount?: number;
  tags: ProblemTag[];
  likesCount?: number;
  dislikesCount?: number;
  hasSolution?: boolean;
  hasChecker?: boolean;
  hidden?: boolean;
  userInfo?: {
    hasSolved?: boolean;
    hasAttempted?: boolean;
  };
}

export interface ProblemLanguageOption {
  lang: string;
  langFull: string;
}

export interface ProblemCategory {
  id: number;
  title: string;
  code: string;
  description: string;
  problemsCount?: number;
  tags: ProblemTag[];
}

export interface ProblemAttemptSummary {
  id: number;
  problemId: number;
  problemTitle: string;
}

export interface ProblemContestPreview {
  id: number;
  title: string;
  problems: Array<{
    id: number;
    symbol?: string;
    title: string;
  }>;
}

export interface DifficultyBreakdown {
  beginner: number;
  allBeginner: number;
  basic: number;
  allBasic: number;
  normal: number;
  allNormal: number;
  medium: number;
  allMedium: number;
  advanced: number;
  allAdvanced: number;
  hard: number;
  allHard: number;
  extremal: number;
  allExtremal: number;
  totalSolved: number;
  totalProblems: number;
}

export interface ProblemsRatingSummary {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
  difficulties: DifficultyBreakdown;
}
