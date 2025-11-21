import { apiClient } from 'shared/api';
import { ArenaStatus } from '../../domain/entities/arena.entity';
import { ArenaChallengesFilters, ArenaListFilters, ArenaPlayersFilters } from '../../domain/ports/arena.repository';

export const arenaApiClient = {
  list: (filters?: ArenaListFilters) => apiClient.apiArenaList(filters),
  getArena: (arenaId: number | string) => apiClient.apiArenaRead(String(arenaId)),
  register: (arenaId: number | string) => apiClient.apiArenaRegistration(String(arenaId), {} as never),
  pause: (arenaId: number | string) => apiClient.apiArenaPause(String(arenaId), {} as never),
  start: (arenaId: number | string) => apiClient.apiArenaStart(String(arenaId), {} as never),
  nextChallenge: (arenaId: number | string) => apiClient.apiArenaNextChallenge(String(arenaId)),
  listPlayers: (arenaId: number | string, filters?: ArenaPlayersFilters) =>
    apiClient.apiArenaPlayersList({ ...filters, arena_id: String(arenaId) }),
  listChallenges: (arenaId: number | string, filters?: ArenaChallengesFilters) =>
    apiClient.apiArenaLastChallenges(String(arenaId), { params: filters } as never),
  playerStatistics: (arenaId: number | string, username: string) =>
    apiClient.apiArenaArenaPlayerStatistics(String(arenaId), { params: { username } } as never),
  topPlayers: (arenaId: number | string) => apiClient.apiArenaTop3(String(arenaId)),
  statistics: (arenaId: number | string) => apiClient.apiArenaStatistics(String(arenaId)),
};

export const statusOptions: { label: string; value: ArenaStatus }[] = [
  { label: 'Not started', value: ArenaStatus.NotStarted },
  { label: 'Live', value: ArenaStatus.Already },
  { label: 'Finished', value: ArenaStatus.Finished },
];
