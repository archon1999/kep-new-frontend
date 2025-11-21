import { Contest, ContestsCategory } from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestCategoryEntity, ContestListItem } from '../../domain/entities/contest.entity';
import { PageResult } from '../../domain/ports/contests.repository';

export const mapContest = (payload: Contest): ContestListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? null,
  status: payload?.status ?? undefined,
  startTime: payload?.startTime ?? undefined,
  finishTime: payload?.finishTime ?? undefined,
  type: payload?.type ?? 'ACM2H',
  category: payload?.category ?? undefined,
  categoryTitle: payload?.categoryTitle ?? undefined,
  logo: payload?.logo ?? null,
  contestantsCount: payload?.contestantsCount ?? 0,
  registrantsCount: payload?.registrantsCount ?? 0,
  problemsCount: payload?.problemsCount ?? 0,
  participationType: payload?.participationType ?? undefined,
  isRated: payload?.isRated ?? undefined,
  userInfo: (payload as any)?.userInfo ?? undefined,
});

export const mapContestCategory = (payload: ContestsCategory): ContestCategoryEntity => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  code: payload?.code ?? '',
  contestsCount: payload?.contestsCount ? Number(payload.contestsCount) : undefined,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
