import useSWR from 'swr';
import { ApiTournamentsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository';
import { TournamentDetail, TournamentListItem } from '../domain/entities/tournament.entity';
import { PageResult, TournamentsRepository } from '../domain/ports/tournaments.repository';

const tournamentsRepository: TournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (filters?: ApiTournamentsListParams) =>
  useSWR<PageResult<TournamentListItem>>(
    filters ? ['tournaments-list', filters] : ['tournaments-list'],
    () => tournamentsRepository.list(filters),
    { keepPreviousData: true },
  );

export const useTournamentDetails = (id?: string | number) =>
  useSWR<TournamentDetail>(id ? ['tournament-detail', id] : null, () => tournamentsRepository.getById(id!));

export const tournamentsQueries = { tournamentsRepository };
