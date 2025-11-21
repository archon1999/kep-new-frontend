import useSWR from 'swr';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository';
import { Tournament } from '../domain/entities/tournament.entity';
import { TournamentsRepository } from '../domain/ports/tournaments.repository';

const tournamentsRepository: TournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (filters?: ApiTournamentsListParams) =>
  useSWR(filters ? ['tournaments-list', filters] : ['tournaments-list'], () => tournamentsRepository.list(filters), {
    keepPreviousData: true,
  });

export const useTournament = (id?: string) =>
  useSWR<Tournament>(id ? ['tournament', id] : null, () => tournamentsRepository.getById(id!));

export const tournamentsQueries = {
  tournamentsRepository,
};
