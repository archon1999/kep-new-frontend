export interface TournamentListItem {
  id: number;
  title: string;
  type: string;
  startTime: string;
  playersCount: number;
}

export type TournamentPlayerStatus = -1 | 0 | 1 | null | undefined;

export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
  status?: TournamentPlayerStatus;
  balls?: number;
}

export interface TournamentDuel {
  id?: number;
  startTime?: string | null;
  finishTime?: string | null;
  status: number;
  playerFirst: TournamentPlayer;
  playerSecond?: TournamentPlayer | null;
}

export interface TournamentStageDuel {
  number: number;
  duel: TournamentDuel;
}

export interface TournamentStage {
  title?: string;
  number: number;
  startTime?: string | null;
  duels: TournamentStageDuel[];
}

export interface TournamentDetail extends TournamentListItem {
  description: string;
  players: TournamentPlayer[];
  stages: TournamentStage[];
  isRegistered?: boolean;
}
