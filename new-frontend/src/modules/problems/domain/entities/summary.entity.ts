export interface ProblemsRatingSummary {
  solved: number;
  rating: number;
  rowIndex?: number;
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

export interface DifficultyBreakdownItem {
  key: keyof ProblemsRatingSummary;
  totalKey: keyof ProblemsRatingSummary;
  labelKey: string;
}
