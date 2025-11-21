export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: number | null;
  balls?: number;
}

export interface TournamentDuel {
  number: number;
  status: number;
  isConfirmed?: boolean;
  isPlayer?: string;
  startTime?: string | null;
  finishTime?: string | null;
  playerFirst: TournamentPlayer;
  playerSecond: TournamentPlayer;
}

export interface TournamentStage {
  title?: string;
  number: number;
  startTime?: string | null;
  duels: TournamentDuel[];
}

export interface TournamentListItem {
  id: number;
  title: string;
  description: string;
  startTime: string;
  type: string;
  playersCount: number;
}

export interface Tournament extends TournamentListItem {
  players: TournamentPlayer[];
  stages: TournamentStage[];
  isRegistered?: boolean;
}
