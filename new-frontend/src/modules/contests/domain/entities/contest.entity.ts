import { ContestParticipationType, ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';

export interface ContestUserInfo {
  isParticipated?: boolean;
  isRegistered?: boolean;
  doubleRatingPurchased?: boolean;
  saveRatingPurchased?: boolean;
  virtualContestPurchased?: boolean;
  unratedContestPurchased?: boolean;
}

export interface ContestListItem {
  id: number;
  title: string;
  description?: string | null;
  status?: number | string;
  startTime?: string;
  finishTime?: string;
  type: ContestType;
  category?: number;
  categoryTitle?: string;
  logo?: string | null;
  contestantsCount: number;
  registrantsCount: number;
  problemsCount: number;
  participationType?: ContestParticipationType;
  isRated?: boolean;
  userInfo?: ContestUserInfo;
}

export interface ContestCategoryEntity {
  id: number;
  title: string;
  code: string;
  contestsCount?: number;
}
