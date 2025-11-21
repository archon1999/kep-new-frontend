import useSWR from 'swr';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository';
import { PageResult, TournamentsRepository } from '../domain/ports/tournaments.repository';
import { Tournament, TournamentListItem } from '../domain/entities/tournament.entity';

const tournamentsRepository: TournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (params?: ApiTournamentsListParams) =>
  useSWR<PageResult<TournamentListItem>>(
    params ? ['tournaments', params] : ['tournaments'],
    () => tournamentsRepository.list(params),
    { keepPreviousData: true },
  );

export const useTournament = (id?: string | number) =>
  useSWR<Tournament>(id ? ['tournament', id] : null, () => tournamentsRepository.getById(id!));

export const tournamentsQueries = {
  tournamentsRepository,
};
