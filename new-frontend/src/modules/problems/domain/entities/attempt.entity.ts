export interface ProblemAttempt {
  id: number;
  problemId: number;
  problemTitle: string;
  verdictTitle: string;
  verdict?: number;
  langFull?: string;
  created?: string;
}
