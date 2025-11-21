export interface ContestUserInfo {
  isParticipated?: boolean;
  isRegistered?: boolean;
  doubleRatingPurchased?: boolean;
  saveRatingPurchased?: boolean;
  virtualContestPurchased?: boolean;
  unratedContestPurchased?: boolean;
}

export enum ContestStatus {
  NOT_STARTED = 'not_started',
  ALREADY = 'already',
  FINISHED = 'finished',
}

export enum ContestParticipationType {
  INDIVIDUAL = 1,
  TEAM = 2,
  BOTH = 3,
}

export interface Contest {
  id: number;
  title: string;
  description?: string | null;
  status?: ContestStatus | string | number;
  startTime?: string;
  finishTime?: string;
  type?: string;
  category?: number;
  categoryTitle?: string;
  isRated?: boolean;
  logo?: string | null;
  contestantsCount?: number;
  registrantsCount?: number;
  problemsCount?: number;
  participationType?: ContestParticipationType | number;
  userInfo?: ContestUserInfo | null;
}

export interface ContestCategory {
  id: number;
  title: string;
  code?: string;
  contestsCount?: number;
}
