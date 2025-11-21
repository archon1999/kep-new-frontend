export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
}

export interface TournamentDuelPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: number;
  balls?: number;
}

export interface TournamentDuel {
  id?: number;
  status?: number;
  playerFirst: TournamentDuelPlayer;
  playerSecond?: TournamentDuelPlayer | null;
  presetTitle?: string;
  startTime?: string | null;
  finishTime?: string | null;
}

export interface TournamentStageDuel {
  number: number;
  duel: TournamentDuel;
}

export interface TournamentStage {
  number: number;
  title?: string;
  duels: TournamentStageDuel[];
  startTime?: string | null;
}

export interface TournamentSummary {
  id: number;
  title: string;
  type: string;
  startTime: string;
  playersCount: number;
}

export interface Tournament extends TournamentSummary {
  description?: string;
  isRegistered: boolean;
  players?: TournamentPlayer[];
  stages?: TournamentStage[];
}
