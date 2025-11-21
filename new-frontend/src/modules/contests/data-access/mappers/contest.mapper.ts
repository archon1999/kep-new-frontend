import { Contest, ContestsCategory } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem, PageResult } from '../../domain/entities/contest.entity';

export const mapContest = (payload: Contest): ContestListItem => ({
  id: payload.id ?? 0,
  title: payload.title,
  description: payload.description ?? null,
  status: payload.status,
  startTime: payload.startTime,
  finishTime: payload.finishTime,
  type: payload.type,
  category: payload.category,
  categoryTitle: payload.categoryTitle,
  isRated: payload.isRated ?? false,
  logo: payload.logo ?? null,
  contestantsCount: payload.contestantsCount,
  registrantsCount: payload.registrantsCount,
  problemsCount: payload.problemsCount,
  participationType: payload.participationType,
});

export const mapContestCategory = (payload: ContestsCategory): ContestCategoryEntity => ({
  id: payload.id,
  title: payload.title,
  code: payload.code,
  contestsCount: payload.contestsCount,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
