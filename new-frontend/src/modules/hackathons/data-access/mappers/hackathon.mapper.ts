import { HackathonStatus } from '../../domain/constants/hackathon-status';
import { Hackathon } from '../../domain/entities/hackathon.entity';
import type { Hackathon as ApiHackathon } from 'shared/api/orval/generated/endpoints/index.schemas';

export const mapHackathonToDomain = (hackathon: ApiHackathon): Hackathon => ({
  id: hackathon.id ?? 0,
  title: hackathon.title,
  slug: hackathon.slug,
  description: hackathon.description,
  startTime: new Date(hackathon.startTime),
  finishTime: new Date(hackathon.finishTime),
  logo: hackathon.logo ?? null,
  status: (hackathon.status ?? HackathonStatus.NOT_STARTED) as HackathonStatus,
  projectsCount: hackathon.projectsCount ?? 0,
  participantsCount: hackathon.participantsCount ?? 0,
  registrantsCount: hackathon.registrantsCount ?? 0,
  isRegistered: Boolean(hackathon.isRegistered),
  isParticipated: Boolean(hackathon.isParticipated),
});
