import { DuelPlayerStatus } from 'shared/api/orval/generated/endpoints/index.schemas';

export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: DuelPlayerStatus;
  balls?: number;
}

export interface TournamentStageDuel {
  number: number;
  duel?: {
    playerFirst: TournamentPlayer;
    playerSecond?: TournamentPlayer;
    status?: number;
  };
}

export interface TournamentStage {
  number: number;
  title?: string;
  startTime?: string | null;
  duels: TournamentStageDuel[];
}

export interface TournamentListItem {
  id: number;
  title: string;
  type: string;
  startTime: string;
  playersCount: number;
}

export interface Tournament extends TournamentListItem {
  description?: string;
  players: TournamentPlayer[];
  stages: TournamentStage[];
  isRegistered?: boolean;
}
