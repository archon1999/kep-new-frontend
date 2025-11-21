import {
  Contest as ContestDto,
  ContestsCategory as ContestCategoryDto,
  ContestsRatingDetail as ContestRatingDto,
} from 'shared/api/orval/generated/endpoints/index.schemas';
import { Contest, ContestCategory, ContestRatingSummary } from '../../domain/entities/contest.entity';
import { PageResult } from '../../domain/ports/contests.repository';

export const mapContest = (payload: ContestDto): Contest => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? null,
  type: payload?.type ?? (payload as any)?.contest_type,
  categoryId: Number(payload?.category ?? (payload as any)?.category_id ?? 0) || undefined,
  categoryTitle: payload?.categoryTitle ?? (payload as any)?.category_title ?? '',
  isRated: Boolean(payload?.isRated ?? (payload as any)?.is_rated ?? false),
  logo: payload?.logo ?? null,
  contestantsCount: payload?.contestantsCount ?? (payload as any)?.contestants_count ?? 0,
  registrantsCount: payload?.registrantsCount ?? (payload as any)?.registrants_count ?? 0,
  problemsCount: payload?.problemsCount ?? (payload as any)?.problems_count ?? 0,
  participationType: payload?.participationType ?? (payload as any)?.participation_type,
  status: Number(payload?.status ?? (payload as any)?.status ?? 0),
  startTime: payload?.startTime ?? (payload as any)?.start_time ?? null,
  finishTime: payload?.finishTime ?? (payload as any)?.finish_time ?? null,
});

export const mapContestCategory = (payload: ContestCategoryDto): ContestCategory => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  contestsCount: payload?.contestsCount ?? (payload as any)?.contests_count ?? 0,
});

export const mapContestRating = (payload: ContestRatingDto): ContestRatingSummary => ({
  rating: payload?.rating ?? (payload as any)?.rating,
  ratingTitle: payload?.ratingTitle ?? (payload as any)?.rating_title,
  ratingPlace: payload?.ratingPlace ?? (payload as any)?.rating_place,
  contestantsCount: payload?.contestantsCount ?? (payload as any)?.contestants_count,
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
