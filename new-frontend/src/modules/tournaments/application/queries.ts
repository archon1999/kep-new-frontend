import useSWR from 'swr';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { Tournament, TournamentListItem } from '../domain/entities/tournament.entity';

const tournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (params?: ApiTournamentsListParams) =>
  useSWR(['tournaments-list', params], () => tournamentsRepository.list(params), {
    keepPreviousData: true,
  });

export const useTournament = (id?: string | number) =>
  useSWR<Tournament>(id ? ['tournament', id] : null, () => tournamentsRepository.getTournament(id!));

export const tournamentsQueries = {
  tournamentsRepository,
};

export type TournamentsListResult = TournamentListItem[];
