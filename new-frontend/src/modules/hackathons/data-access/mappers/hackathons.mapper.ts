import { mapProjectDetailToDomain, mapProjectListToDomain, mapProjectAttemptToDomain, mapAttemptsPageToDomain } from 'modules/projects/data-access/mappers/project.mapper.ts';
import { ProjectAttemptList, ApiProjectAttemptsList200 } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Hackathon, HackathonRegistrant, HackathonStanding } from '../../domain/entities/hackathon.entity';
import { HackathonStatus } from '../../domain/constants';
import { HackathonProject as HackathonProjectDomain } from '../../domain/entities/hackathon-project.entity';

const toBoolean = (value?: string | boolean) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1';
  return false;
};

const toNumber = (value?: string | number | null) => {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const mapProjectFromDto = (project: any) => {
  if (!project) return mapProjectListToDomain({
    id: 0,
    slug: '',
    title: '',
    descriptionShort: '',
    availableTechnologies: [],
    level: 0,
    levelTitle: '',
    tags: [],
    inThePipeline: false,
    purchaseKepcoinValue: 0,
    kepcoins: 0,
    logo: '',
    purchased: false,
  });

  if ('description' in project || 'tasks' in project) {
    return mapProjectDetailToDomain(project as any);
  }

  return mapProjectListToDomain(project as any);
};

const parseStatus = (status?: number | string): HackathonStatus => {
  if (status === undefined || status === null) return HackathonStatus.NOT_STARTED;
  const parsed = Number(status);
  if (Number.isNaN(parsed)) return HackathonStatus.NOT_STARTED;
  if (parsed === 1) return HackathonStatus.FINISHED;
  if (parsed === 0) return HackathonStatus.IN_PROGRESS;
  return HackathonStatus.NOT_STARTED;
};

export const mapHackathonDtoToDomain = (dto: any): Hackathon => ({
  id: dto.id ?? 0,
  title: dto.title ?? '',
  slug: dto.slug ?? '',
  description: dto.description ?? dto.descriptionShort,
  startTime: dto.start_time ?? dto.startTime,
  finishTime: dto.finish_time ?? dto.finishTime,
  logo: dto.logo ?? null,
  status: parseStatus(dto.status),
  projectsCount: toNumber(dto.projectsCount ?? dto.projects_count),
  participantsCount: toNumber(dto.participantsCount ?? dto.participants_count),
  registrantsCount: toNumber(dto.registrantsCount ?? dto.registrants_count),
  isRegistered: toBoolean(dto.isRegistered ?? dto.is_registered),
  isParticipated: toBoolean(dto.isParticipated ?? dto.is_participated),
});

export const mapHackathonProjectDtoToDomain = (dto: any): HackathonProjectDomain => ({
  id: dto.id ?? 0,
  symbol: dto.symbol ?? '',
  project: mapProjectFromDto(dto.project ?? dto),
});

export const mapHackathonRegistrantToDomain = (dto: any): HackathonRegistrant => ({
  username: dto.username ?? '',
  userAvatar: dto.userAvatar ?? dto.avatar ?? dto.user_avatar,
  userFullName: dto.userFullName ?? dto.fullName ?? dto.user_full_name,
});

export const mapHackathonStandingToDomain = (dto: any): HackathonStanding => ({
  username: dto.username ?? '',
  userAvatar: dto.userAvatar ?? dto.avatar ?? dto.user_avatar,
  userFullName: dto.userFullName ?? dto.fullName ?? dto.user_full_name,
  points: Number(dto.points ?? 0),
  rank: dto.rank,
  projectResults: (dto.projectResults ?? dto.project_results ?? []).map((result: any) => ({
    symbol: result.symbol ?? '',
    points: Number(result.points ?? 0),
    hackathonTime: result.hackathonTime ?? result.hackathon_time,
  })),
});

export const mapAttemptsPageFromHackathon = (page: ApiProjectAttemptsList200 | any) =>
  mapAttemptsPageToDomain(page as ApiProjectAttemptsList200);

export const mapAttemptFromHackathon = (attempt: ProjectAttemptList | any) => mapProjectAttemptToDomain(attempt as ProjectAttemptList);
