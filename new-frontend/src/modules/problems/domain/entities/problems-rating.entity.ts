export interface ProblemsRatingSummary {
  solved: number;
  rating: number;
  rank: number;
  usersCount: number;
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
}
