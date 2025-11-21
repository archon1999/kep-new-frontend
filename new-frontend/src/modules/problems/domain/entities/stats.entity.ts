export interface ProblemsSummary {
  solved: number;
  rating?: number;
  attempts?: number;
  likesReceived?: number;
  userRank?: number;
  totalProblems?: number;
}

export interface DifficultiesBreakdown {
  beginner: number;
  basic: number;
  normal: number;
  medium: number;
  advanced: number;
  hard: number;
  extremal: number;
  allBeginner?: number;
  allBasic?: number;
  allNormal?: number;
  allMedium?: number;
  allAdvanced?: number;
  allHard?: number;
  allExtremal?: number;
  totalSolved?: number;
  totalProblems?: number;
}

export interface ProblemAttemptPreview {
  id: number;
  problemId?: number;
  problemTitle: string;
  verdict: string;
  language?: string;
  createdAt?: string;
}

export interface ProblemHighlight {
  id: number;
  title: string;
  difficulty: number;
  difficultyTitle: string;
  attemptsCount?: number;
}
