import { HackathonStatus } from '../constants/hackathon-status';

export interface Hackathon {
  id: number;
  title: string;
  slug: string;
  description?: string;
  startTime: Date;
  finishTime: Date;
  logo?: string | null;
  status: HackathonStatus;
  projectsCount: number;
  participantsCount: number;
  registrantsCount: number;
  isRegistered: boolean;
  isParticipated: boolean;
}
