export interface ContestListItem {
  id: number;
  title: string;
  description?: string | null;
  status?: string | number;
  startTime?: string;
  finishTime?: string;
  type?: string;
  category?: string | number;
  categoryTitle?: string;
  isRated?: boolean;
  logo?: string | null;
  contestantsCount?: number;
  registrantsCount?: number;
  problemsCount?: number;
  participationType?: number;
}

export interface ContestCategoryEntity {
  id?: number;
  title: string;
  code: string;
  contestsCount?: number | string;
}

export interface PageResult<T> {
  page: number;
  pageSize: number;
  count: number;
  total: number;
  pagesCount: number;
  data: T[];
}
