import useSWR from 'swr';
import { HttpTournamentsRepository } from '../data-access/repository/http.tournaments.repository.ts';
import { Tournament, TournamentListItem } from '../domain/entities/tournament.entity.ts';
import { PageResult, TournamentsListFilters } from '../domain/ports/tournaments.repository.ts';

const tournamentsRepository = new HttpTournamentsRepository();

export const useTournamentsList = (filters?: TournamentsListFilters) =>
  useSWR<PageResult<TournamentListItem>>(
    filters ? ['tournaments-list', filters] : ['tournaments-list'],
    () => tournamentsRepository.list(filters),
    { keepPreviousData: true },
  );

export const useTournament = (id?: string | number) =>
  useSWR<Tournament>(id ? ['tournament-detail', id] : null, () => tournamentsRepository.getById(id!));

export const tournamentsQueries = {
  tournamentsRepository,
};
