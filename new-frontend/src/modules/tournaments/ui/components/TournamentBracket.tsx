import { useMemo } from 'react';
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tournament, TournamentPlayer, TournamentStage } from '../../domain/entities/tournament.entity';

interface BracketPlayer {
  username: string;
  ratingTitle?: string;
  balls?: number;
  status?: number | null;
}

interface BracketMatch {
  id: string;
  players: [BracketPlayer, BracketPlayer];
}

interface BracketRound {
  name: string;
  matches: BracketMatch[];
}

interface Props {
  tournament?: Tournament;
}

const mapPlayer = (player?: TournamentPlayer): BracketPlayer => ({
  username: player?.username ?? '-',
  ratingTitle: player?.ratingTitle,
  balls: player?.balls,
  status: player?.status ?? null,
});

const buildPlaceholderRounds = (players: TournamentPlayer[], translateRound: (size: number) => string): BracketRound[] => {
  const paddedPlayers = [...players];
  while (paddedPlayers.length % 2 !== 0) {
    paddedPlayers.push(undefined as unknown as TournamentPlayer);
  }

  const totalRounds = Math.ceil(Math.log2(Math.max(paddedPlayers.length, 1)));
  const rounds: BracketRound[] = [];
  let currentPlayers = paddedPlayers;

  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex += 1) {
    const matches: BracketMatch[] = [];
    for (let i = 0; i < currentPlayers.length; i += 2) {
      const first = currentPlayers[i];
      const second = currentPlayers[i + 1];
      matches.push({
        id: `placeholder-${roundIndex}-${i}`,
        players: [mapPlayer(first), mapPlayer(second)],
      });
    }

    const roundSize = Math.max(currentPlayers.length, 2);
    rounds.push({
      name: translateRound(roundSize),
      matches,
    });

    currentPlayers = matches.map((match) => ({
      ...match.players[0],
    })) as unknown as TournamentPlayer[];
  }

  return rounds;
};

const buildRounds = (stages: TournamentStage[], players: TournamentPlayer[], translateRound: (size: number) => string): BracketRound[] => {
  if (!stages.length) {
    return buildPlaceholderRounds(players, translateRound);
  }

  const sortedStages = [...stages].sort((a, b) => a.number - b.number);
  const totalRounds = sortedStages.length || Math.ceil(Math.log2(Math.max(players.length, 1)));

  return sortedStages.map((stage, index) => {
    const matches: BracketMatch[] = (stage.duels ?? []).map((stageDuel, duelIndex) => {
      const firstPlayer = stageDuel.duel?.playerFirst;
      const secondPlayer = stageDuel.duel?.playerSecond;
      return {
        id: `stage-${stage.number}-${duelIndex}`,
        players: [mapPlayer(firstPlayer), mapPlayer(secondPlayer)],
      };
    });

    const inferredSize = stage.duels?.length ? stage.duels.length * 2 : Math.pow(2, totalRounds - index);

    return {
      name: stage.title || (matches.length === 1 ? translateRound(1) : translateRound(inferredSize)),
      matches,
    };
  });
};

const TournamentBracket = ({ tournament }: Props) => {
  const { t } = useTranslation();

  const rounds = useMemo(() => {
    const players = tournament?.players ?? [];
    const stages = tournament?.stages ?? [];
    const roundName = (size: number) => {
      if (size === 2) return t('tournaments.semifinal');
      if (size === 1) return t('tournaments.final');
      if (size === 4) return t('tournaments.quarterfinal');
      if (size === 16) return t('tournaments.roundOf', { count: 16 });
      return t('tournaments.roundOf', { count: size });
    };

    return buildRounds(stages, players, roundName);
  }, [t, tournament?.players, tournament?.stages]);

  if (!tournament) return null;

  return (
    <Card background={1} sx={{ borderRadius: 3, outline: 'none' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" rowGap={1}>
          <Typography variant="h5" fontWeight={800}>
            {t('tournaments.bracketTitle')}
          </Typography>
          <Chip label={t('tournaments.playersCount', { count: tournament.players?.length ?? 0 })} size="small" />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {t('tournaments.bracketDescription')}
        </Typography>

        <Box sx={{ overflowX: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(rounds.length, 1)}, minmax(240px, 1fr))`,
              gap: 2,
              minWidth: rounds.length ? rounds.length * 240 : 240,
            }}
          >
            {rounds.map((round) => (
              <Stack direction="column" spacing={2} key={round.name}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {round.name}
                </Typography>

                {round.matches.length ? (
                  round.matches.map((match) => (
                    <Card key={match.id} variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider' }}>
                      <CardContent sx={{ p: 1.5 }}>
                        <Stack direction="column" spacing={1.5}>
                          {match.players.map((player, idx) => {
                            const isWinner = player.status === 1;
                            const isLoser = player.status === -1;
                            return (
                              <Stack
                                key={`${match.id}-player-${idx}`}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ overflow: 'hidden' }}>
                                  <Box
                                    sx={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      bgcolor: isWinner ? 'primary.main' : 'text.disabled',
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    sx={{
                                      color: isWinner
                                        ? 'primary.main'
                                        : isLoser
                                          ? 'text.secondary'
                                          : 'text.primary',
                                    }}
                                  >
                                    {player.username || t('tournaments.emptySlot')}
                                  </Typography>
                                  {player.ratingTitle ? (
                                    <Chip label={player.ratingTitle} size="small" variant="outlined" />
                                  ) : null}
                                </Stack>
                                <Typography variant="body2" color={isWinner ? 'primary.main' : 'text.secondary'}>
                                  {typeof player.balls === 'number' ? player.balls : '—'}
                                </Typography>
                              </Stack>
                            );
                          })}
                        </Stack>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" color="text.secondary">
                          {t('tournaments.matchLabel')}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('tournaments.noMatches')}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TournamentBracket;
