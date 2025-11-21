import { ArenaPlayerStatistics } from '../../domain/entities/arena-player-statistics.entity';

export const mapArenaPlayerStatistics = (data: any): ArenaPlayerStatistics => {
  const { perfomance, performance, ...rest } = data ?? {};

  return {
    ...rest,
    performance: performance ?? perfomance ?? 0,
    opponents: rest.opponents ?? [],
  } as ArenaPlayerStatistics;
};
