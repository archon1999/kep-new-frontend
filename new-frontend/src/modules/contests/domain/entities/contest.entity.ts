export enum ContestStatus {
  NOT_STARTED = -1,
  ALREADY = 0,
  FINISHED = 1,
}

export interface Contest {
  id: number;
  title: string;
  description?: string | null;
  type?: string;
  categoryId?: number;
  categoryTitle?: string;
  isRated?: boolean;
  logo?: string | null;
  contestantsCount?: number;
  registrantsCount?: number;
  problemsCount?: number;
  participationType?: number | string;
  status?: number | null;
  startTime?: string | null;
  finishTime?: string | null;
}

export interface ContestCategory {
  id: number;
  title: string;
  contestsCount?: number;
}

export interface ContestRatingSummary {
  rating?: number;
  ratingTitle?: string;
  ratingPlace?: number;
  contestantsCount?: number;
}
