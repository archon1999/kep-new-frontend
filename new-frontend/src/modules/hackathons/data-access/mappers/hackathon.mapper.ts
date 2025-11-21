import { Hackathon as HackathonDto } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon } from '../../domain/entities/hackathon.entity';
import { PageResult } from '../../domain/ports/hackathons.repository';

export const mapHackathon = (payload: HackathonDto): Hackathon => ({
  id: payload?.id ?? 0,
  title: payload?.title ?? '',
  slug: payload?.slug ?? '',
  description: payload?.description ?? '',
  startTime: payload?.startTime ?? (payload as any)?.start_time,
  finishTime: payload?.finishTime ?? (payload as any)?.finish_time,
  logo: payload?.logo ?? null,
  status: payload?.status ?? (payload as any)?.status,
  projectsCount: payload?.projectsCount ?? (payload as any)?.projects_count ?? 0,
  participantsCount: payload?.participantsCount ?? (payload as any)?.participants_count ?? 0,
  registrantsCount: payload?.registrantsCount ?? (payload as any)?.registrants_count ?? 0,
  isRegistered: Boolean(payload?.isRegistered ?? (payload as any)?.is_registered ?? false),
  isParticipated: Boolean(payload?.isParticipated ?? (payload as any)?.is_participated ?? false),
});

export const mapPageResult = <T>(payload: any, mapItem: (item: any) => T): PageResult<T> => ({
  page: payload?.page ?? 1,
  pageSize: payload?.pageSize ?? payload?.page_size ?? payload?.per_page ?? 0,
  count: payload?.count ?? payload?.data?.length ?? 0,
  total: payload?.total ?? payload?.count ?? payload?.data?.length ?? 0,
  pagesCount: payload?.pagesCount ?? payload?.pages_count ?? payload?.total_pages ?? 0,
  data: (payload?.data ?? []).map(mapItem),
});
