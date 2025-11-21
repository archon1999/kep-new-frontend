import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { BracketsManager } from 'brackets-manager';
import {
  buildParticipantImages,
  mapPageResult,
  mapTournamentDetail,
  mapTournamentListItem,
} from '../mappers/tournament.mapper';
import { tournamentsApiClient } from '../api/tournaments.client';
import { InMemoryDatabase } from '../mappers/brackets.memory';
import { TournamentBracketData, TournamentDetail, TournamentListItem } from '../../domain/entities/tournament.entity';
import { PageResult, TournamentsRepository } from '../../domain/ports/tournaments.repository';

const getNearestPowTwo = (value: number) => {
  let size = 1;
  while (size < value) {
    size *= 2;
  }
  return size;
};

export class HttpTournamentsRepository implements TournamentsRepository {
  async list(params?: ApiTournamentsListParams): Promise<PageResult<TournamentListItem>> {
    const response = await tournamentsApiClient.list(params);
    return mapPageResult(response, mapTournamentListItem);
  }

  async getById(id: number | string): Promise<TournamentDetail> {
    const response = await tournamentsApiClient.getById(id);
    return mapTournamentDetail(response);
  }

  async buildBracket(tournament: TournamentDetail): Promise<TournamentBracketData> {
    const db = new InMemoryDatabase();
    const manager = new BracketsManager(db);

    const participants = (tournament.players ?? []).map((player) => ({
      tournament_id: 0,
      id: player.id,
      name: player.username,
    }));

    const size = Math.max(16, getNearestPowTwo(tournament.players?.length ?? 16));
    const seeding = participants
      .map((player) => player.name)
      .concat(Array.from({ length: Math.max(0, size - participants.length) }, () => 'TBD'));

    db.setData({
      participant: participants,
      stage: [],
      group: [],
      round: [],
      match: [],
      match_game: [],
    });

    await manager.create({
      name: 'Knockout',
      tournamentId: 0,
      type: 'single_elimination',
      seeding,
      settings: {
        seedOrdering: ['natural'],
        size,
      },
    });

    let matchId = 0;
    for (const stage of tournament.stages ?? []) {
      for (const stageDuel of stage.duels ?? []) {
        if (stageDuel.duel && stageDuel.duel.playerSecond) {
          if (stageDuel.duel.status == null) {
            matchId += 1;
            continue;
          }

          const opponent1: any = { id: stageDuel.duel.playerFirst.id };
          if (stageDuel.duel.status === 1 && stageDuel.duel.playerFirst.status != null) {
            opponent1.result = ['loss', 'draw', 'win'][(stageDuel.duel.playerFirst.status as number) + 1];
          }

          const opponent2: any = { id: stageDuel.duel.playerSecond.id };
          if (stageDuel.duel.status === 1 && stageDuel.duel.playerSecond.status != null) {
            opponent2.result = ['loss', 'draw', 'win'][(stageDuel.duel.playerSecond.status as number) + 1];
          }

          await manager.update.match({
            id: matchId,
            status: 4,
            opponent1,
            opponent2,
          });
        }
        matchId += 1;
      }
    }

    const data = await manager.get.stageData(0);

    return {
      stages: data.stage,
      matches: data.match,
      matchGames: data.match_game,
      participants: data.participant,
      participantImages: buildParticipantImages(tournament.players ?? []),
    };
  }
}
