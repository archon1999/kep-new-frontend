export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: number | null;
  balls?: number | null;
}

export interface TournamentDuel {
  id?: number;
  status?: number;
  playerFirst: TournamentPlayer;
  playerSecond?: TournamentPlayer;
  presetTitle?: string;
  startTime?: string | null;
  finishTime?: string | null;
}

export interface TournamentStage {
  number: number;
  title?: string;
  startTime?: string | null;
  duels: TournamentDuel[];
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
  players?: TournamentPlayer[];
  stages?: TournamentStage[];
  isRegistered?: boolean;
}
