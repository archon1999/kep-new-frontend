export type TournamentType = 'LessCode' | 'BallF' | string;

export interface TournamentListItem {
  id: number;
  title: string;
  type: TournamentType;
  startTime: string;
  playersCount: number;
}

export interface TournamentDuelPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: number | null;
  balls?: number;
}

export interface TournamentDuel {
  id: number;
  status: number;
  startTime?: string | null;
  finishTime?: string | null;
  playerFirst: TournamentDuelPlayer;
  playerSecond?: TournamentDuelPlayer | null;
}

export interface TournamentStageDuel {
  number: number;
  duel?: TournamentDuel | null;
}

export interface TournamentStage {
  number: number;
  title?: string;
  startTime?: string | null;
  duels: TournamentStageDuel[];
}

export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
}

export interface Tournament {
  id: number;
  title: string;
  description: string;
  type: TournamentType;
  startTime: string;
  isRegistered: boolean;
  players: TournamentPlayer[];
  stages: TournamentStage[];
}
