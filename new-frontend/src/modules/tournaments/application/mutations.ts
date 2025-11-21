import useSWRMutation from 'swr/mutation';
import { tournamentsQueries } from './queries';

export const useTournamentRegister = (id?: string) =>
  useSWRMutation(id ? ['tournament-register', id] : null, () => tournamentsQueries.tournamentsRepository.register(id!));
