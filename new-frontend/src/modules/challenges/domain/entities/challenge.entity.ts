export interface ChallengeParticipant {
  username: string;
  rating: number;
  rankTitle: string;
  result?: string;
  delta?: number;
  newRating?: number;
  newRankTitle?: string;
}

export interface Challenge {
  id: number;
  playerFirst: ChallengeParticipant;
  playerSecond: ChallengeParticipant;
  finished?: string;
  questionsCount: number;
  timeSeconds: number;
  rated?: boolean;
  questionTimeType?: number;
}

export interface ChallengesListResponse {
  data: Challenge[];
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
}
