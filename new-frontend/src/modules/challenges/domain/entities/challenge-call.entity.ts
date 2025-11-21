export interface ChallengeCallChapter {
  id: number;
  title: string;
}

export interface ChallengeCall {
  id: number;
  username: string;
  rankTitle: string;
  timeSeconds: number;
  questionsCount: number;
  chapters: ChallengeCallChapter[];
  created?: string;
}
