import { DuelList, DuelPlayerStatus, TournamentDetailType } from 'shared/api/orval/generated/endpoints/index.schemas';

export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
}

export interface TournamentStageDuel {
  number: number;
  duel?: DuelList;
}

export interface TournamentStage {
  title?: string;
  number: number;
  startTime?: string | null;
  duels: TournamentStageDuel[];
}

export interface TournamentListItem {
  id: number;
  title: string;
  type: TournamentDetailType;
  startTime: string;
  playersCount: number;
}

export interface TournamentDetail extends TournamentListItem {
  description: string;
  players: TournamentPlayer[];
  stages: TournamentStage[];
  isRegistered: boolean;
}

export interface TournamentBracketOpponent {
  id: number | null;
  name: string;
  ratingTitle?: string;
  score?: number | null;
  result?: 'win' | 'loss' | 'draw';
  status?: DuelPlayerStatus;
}

export interface TournamentBracketMatch {
  id: string;
  opponents: [TournamentBracketOpponent, TournamentBracketOpponent];
  status: number | null;
  round: number;
}

export interface TournamentBracketData {
  stages: any[];
  matches: any[];
  matchGames: any[];
  participants: any[];
  participantImages: { participantId: number; imageUrl: string }[];
}
