export interface ChallengePlayer {
  username: string;
  rating?: number;
  newRating?: number;
  result?: number;
  results?: string;
  rankTitle: string;
  newRankTitle: string;
  delta?: number;
}

export interface Challenge {
  id?: number;
  playerFirst: ChallengePlayer;
  playerSecond: ChallengePlayer;
  finished?: string;
  questionsCount: number;
  timeSeconds: number;
  rated?: boolean;
  questionTimeType?: number;
}

export interface ChallengesListRequest {
  page?: number;
  pageSize?: number;
  username?: string;
  arenaId?: number;
}

export interface ChallengesListResponse {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: Challenge[];
}
