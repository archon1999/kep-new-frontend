import { HackathonStatus } from '../constants';

export interface Hackathon {
  id: number;
  title: string;
  slug: string;
  description?: string;
  startTime?: string;
  finishTime?: string;
  logo?: string | null;
  status: HackathonStatus;
  projectsCount?: number;
  participantsCount?: number;
  registrantsCount?: number;
  isRegistered?: boolean;
  isParticipated?: boolean;
}

export interface HackathonProjectResult {
  symbol: string;
  points: number;
  hackathonTime?: string;
}

export interface HackathonStanding {
  username: string;
  userAvatar?: string;
  userFullName?: string;
  points: number;
  rank?: number;
  projectResults?: HackathonProjectResult[];
}

export interface HackathonRegistrant {
  username: string;
  userAvatar?: string;
  userFullName?: string;
}
