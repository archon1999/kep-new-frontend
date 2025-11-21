import { ContestCategory, ContestParticipationType, ContestType } from 'shared/api/orval/generated/endpoints/index.schemas';

export interface ContestAuthorEntity {
  username: string;
  ratingTitle?: string;
}

export interface ContestListItem {
  id: number;
  title: string;
  description?: string | null;
  status?: string;
  startTime?: string;
  finishTime?: string;
  type: ContestType;
  category: ContestCategory;
  categoryTitle: string;
  isRated?: boolean;
  logo?: string | null;
  contestantsCount: number;
  registrantsCount: number;
  problemsCount: number;
  participationType: ContestParticipationType;
  authors: ContestAuthorEntity[];
}

export interface ContestCategoryEntity {
  id: number;
  title: string;
  slug: string;
  icon?: string;
}
