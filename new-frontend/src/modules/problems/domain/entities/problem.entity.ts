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
  notSolved?: number;
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

export interface ProblemUserSummary {
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rating?: number;
  ratingTitle?: string;
}

export interface ProblemsRatingRow {
  rowIndex: number;
  rating?: number;
  solved?: number;
  beginner?: number;
  basic?: number;
  normal?: number;
  medium?: number;
  advanced?: number;
  hard?: number;
  extremal?: number;
  user: ProblemUserSummary;
}

export interface PeriodRatingEntry {
  username: string;
  solved: number;
  ratingTitle?: string;
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

export interface AttemptListItem {
  id: number;
  user: ProblemUserSummary;
  teamName?: string;
  problemId: number;
  problemTitle: string;
  contestProblemSymbol?: string;
  contestId?: number;
  contestTime?: string | null;
  verdict?: number;
  verdictTitle: string;
  lang: string;
  langFull: string;
  testCaseNumber?: number | null;
  time?: number;
  memory?: number;
  sourceCodeSize?: number;
  balls?: number | null;
  canView?: boolean;
  canTestView?: boolean;
  kepcoinValue?: number;
  testCaseKepcoinValue?: number;
  created?: string;
  problemHasCheckInput?: boolean;
}

export interface AttemptFilterOption {
  label: string;
  value: number;
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
