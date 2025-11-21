import { Contest as ContestDto, ContestsCategory } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Contest, ContestCategory, ContestUserInfo } from '../../domain/entities/contest.entity';
import { PageResult } from '../../domain/ports/contests.repository';

const mapContestUserInfo = (payload: any): ContestUserInfo | null => {
  if (!payload) return null;

  return {
    isParticipated: Boolean(payload.isParticipated ?? payload.is_participated ?? payload?.is_participated === 1),
    isRegistered: Boolean(payload.isRegistered ?? payload.is_registered ?? payload?.is_registered === 1),
    doubleRatingPurchased: Boolean(payload.doubleRatingPurchased ?? payload.double_rating_purchased),
    saveRatingPurchased: Boolean(payload.saveRatingPurchased ?? payload.save_rating_purchased),
    virtualContestPurchased: Boolean(payload.virtualContestPurchased ?? payload.virtual_contest_purchased),
    unratedContestPurchased: Boolean(payload.unratedContestPurchased ?? payload.unrated_contest_purchased),
  };
};

export const mapContest = (payload: ContestDto): Contest => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  description: payload?.description ?? (payload as any)?.description ?? null,
  status: (payload as any)?.status ?? payload?.status,
  startTime: (payload as any)?.startTime ?? (payload as any)?.start_time,
  finishTime: (payload as any)?.finishTime ?? (payload as any)?.finish_time,
  type: (payload as any)?.type ?? (payload as any)?.contest_type ?? payload?.type,
  category: Number((payload as any)?.category ?? payload?.category ?? 0),
  categoryTitle: (payload as any)?.categoryTitle ?? (payload as any)?.category_title ?? '',
  isRated: Boolean((payload as any)?.isRated ?? (payload as any)?.is_rated ?? payload?.isRated ?? false),
  logo: (payload as any)?.logo ?? payload?.logo ?? null,
  contestantsCount: (payload as any)?.contestantsCount ?? (payload as any)?.contestants_count ?? 0,
  registrantsCount: (payload as any)?.registrantsCount ?? (payload as any)?.registrants_count ?? 0,
  problemsCount: (payload as any)?.problemsCount ?? (payload as any)?.problems_count ?? 0,
  participationType: (payload as any)?.participationType ?? (payload as any)?.participation_type,
  userInfo: mapContestUserInfo((payload as any)?.userInfo ?? (payload as any)?.user_info),
});

export const mapContestCategory = (payload: ContestsCategory): ContestCategory => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  code: payload?.code ?? (payload as any)?.code,
  contestsCount: Number((payload as any)?.contestsCount ?? (payload as any)?.contests_count ?? 0),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
