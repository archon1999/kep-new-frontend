export enum TournamentType {
  LessCode = 'LessCode',
  BallF = 'BallF',
}

export interface TournamentListItem {
  id: number;
  title: string;
  type: TournamentType | string;
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
  number: number;
  startTime?: string | null;
  finishTime?: string | null;
  status: number;
  isConfirmed?: boolean;
  presetDifficulty?: number | null;
  playerFirst: TournamentDuelPlayer;
  playerSecond: TournamentDuelPlayer;
}

export interface TournamentStage {
  title?: string;
  number: number;
  startTime?: string | null;
  duels: TournamentDuel[];
}

export interface Tournament extends TournamentListItem {
  description: string;
  players: TournamentDuelPlayer[];
  stages: TournamentStage[];
  isRegistered: boolean;
}
