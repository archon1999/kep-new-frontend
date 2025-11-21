export interface ChallengesRating {
  username: string;
  rankTitle: string;
  rating?: number;
  wins?: number;
  draws?: number;
  losses?: number;
}

export interface ChallengesRatingListResponse {
  data: ChallengesRating[];
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
}
