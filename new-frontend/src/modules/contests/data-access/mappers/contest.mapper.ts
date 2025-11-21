import {
  ApiContestsList200,
  Contest,
  ContestAuthor,
  ContestsCategory,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { ContestAuthorEntity, ContestCategoryEntity, ContestListItem } from '../../domain/entities/contest.entity';
import { PageResult } from '../../domain/ports/contests.repository';

const mapAuthor = (payload?: ContestAuthor): ContestAuthorEntity => ({
  username: payload?.username ?? '',
  ratingTitle: payload?.ratingTitle ?? undefined,
});

export const mapContest = (payload: Contest): ContestListItem => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? null,
  status: payload?.status ?? undefined,
  startTime: payload?.startTime ?? undefined,
  finishTime: payload?.finishTime ?? undefined,
  type: payload?.type ?? 'LessCode',
  category: payload?.category ?? 1,
  categoryTitle: payload?.categoryTitle ?? '',
  isRated: payload?.isRated ?? false,
  logo: payload?.logo ?? null,
  contestantsCount: payload?.contestantsCount ?? 0,
  registrantsCount: payload?.registrantsCount ?? 0,
  problemsCount: payload?.problemsCount ?? 0,
  participationType: payload?.participationType ?? 1,
  authors: (payload?.authors ?? []).map(mapAuthor),
});

export const mapCategory = (payload: ContestsCategory): ContestCategoryEntity => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  slug: payload?.slug ?? '',
  icon: payload?.icon ?? undefined,
  contestsCount: payload?.contestsCount ? Number(payload.contestsCount) : 0,
});

export const mapPageResult = (payload: ApiContestsList200, mapItem: (item: Contest) => ContestListItem): PageResult<ContestListItem> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
