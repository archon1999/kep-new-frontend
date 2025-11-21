import { Fragment, useMemo } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { Tournament, TournamentDuel, TournamentPlayer, TournamentStage } from '../../domain/entities/tournament.entity';

interface TournamentBracketProps {
  tournament: Tournament;
}

const BRACKET_STAGE_TITLES: Record<number, string> = {
  1: 'tournaments.bracket.roundOf16',
  2: 'tournaments.bracket.quarterfinals',
  3: 'tournaments.bracket.semifinals',
  4: 'tournaments.bracket.final',
};

const mapPlayerStatusColor = (player?: TournamentPlayer) => {
  if (player?.status === 1) return 'success.light';
  if (player?.status === -1) return 'error.light';
  return 'background.default';
};

const mapPlayerStatusLabel = (player?: TournamentPlayer) => {
  if (player?.status === 1) return 'tournaments.bracket.winner';
  if (player?.status === -1) return 'tournaments.bracket.eliminated';
  return 'tournaments.bracket.pending';
};

const PlayerRow = ({ player, t }: { player: TournamentPlayer; t: TFunction }) => (
  <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
    <Stack direction="row" spacing={1} alignItems="center">
      <IconifyIcon icon="mdi:account-circle" fontSize={18} color="text.secondary" />
      <Typography variant="body2" fontWeight={700} color="text.primary">
        {player.username}
      </Typography>
      <Chip size="small" variant="outlined" color="default" label={player.ratingTitle} />
    </Stack>

    <Stack direction="row" spacing={1} alignItems="center">
      {typeof player.balls === 'number' ? (
        <Chip size="small" color="secondary" variant="soft" label={player.balls} />
      ) : null}
      <Chip
        size="small"
        variant="outlined"
        color={player.status === 1 ? 'success' : 'default'}
        label={t(mapPlayerStatusLabel(player))}
      />
    </Stack>
  </Stack>
);

const TournamentMatchCard = ({
  duel,
  roundIndex,
  totalRounds,
  t,
}: {
  duel: TournamentDuel;
  roundIndex: number;
  totalRounds: number;
  t: TFunction;
}) => {
  const connectorHeight = Math.max(32, 24 * Math.pow(2, roundIndex));

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          minWidth: 260,
          boxShadow: '0px 10px 30px rgba(0,0,0,0.05)',
          '& .player-row': {
            bgcolor: 'background.default',
            borderRadius: 1.5,
            p: 1.25,
          },
        }}
      >
        <Stack direction="column" spacing={1.25}>
          <Box className="player-row" sx={{ bgcolor: mapPlayerStatusColor(duel.playerFirst) }}>
            <PlayerRow player={duel.playerFirst} t={t} />
          </Box>
          <Box className="player-row" sx={{ bgcolor: mapPlayerStatusColor(duel.playerSecond) }}>
            <PlayerRow player={duel.playerSecond} t={t} />
          </Box>
        </Stack>
      </Paper>

      {roundIndex < totalRounds - 1 ? (
        <Box
          sx={{
            position: 'absolute',
            right: -30,
            top: '50%',
            width: 30,
            height: 2,
            bgcolor: 'divider',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -1,
              top: -(connectorHeight / 2),
              width: 2,
              height: connectorHeight,
              bgcolor: 'divider',
              borderRadius: 2,
            },
          }}
        />
      ) : null}
    </Box>
  );
};

const buildPlaceholderPlayer = (index: number): TournamentPlayer => ({
  id: index,
  username: 'TBD',
  ratingTitle: '—',
});

const buildPlaceholderStages = (players: TournamentPlayer[]): TournamentStage[] => {
  const firstRound: TournamentStage = {
    number: 1,
    duels: [],
  };

  for (let i = 0; i < players.length; i += 2) {
    firstRound.duels.push({
      number: i / 2 + 1,
      status: 0,
      playerFirst: players[i] ?? buildPlaceholderPlayer(i + 1),
      playerSecond: players[i + 1] ?? buildPlaceholderPlayer(i + 2),
    } as TournamentDuel);
  }

  const stages: TournamentStage[] = [firstRound];

  while (stages.length < 4) {
    const previous = stages[stages.length - 1];
    const duels: TournamentDuel[] = Array.from({ length: Math.max(1, Math.ceil(previous.duels.length / 2)) }).map((_, idx) => ({
      number: idx + 1,
      status: 0,
      playerFirst: buildPlaceholderPlayer((idx + 1) * 2 - 1),
      playerSecond: buildPlaceholderPlayer((idx + 1) * 2),
    }));

    stages.push({ number: stages.length + 1, duels });
  }

  return stages;
};

const normalizeStages = (tournament: Tournament) => {
  if (tournament.stages?.length) {
    const sorted = [...tournament.stages].sort((a, b) => a.number - b.number);
    if (sorted.length >= 4) return sorted.slice(0, 4);

    const padded = [...sorted];
    while (padded.length < 4) {
      const previous = padded[padded.length - 1];
      const duels: TournamentDuel[] = Array.from({ length: Math.max(1, Math.ceil(previous.duels.length / 2)) }).map((_, idx) => ({
        number: idx + 1,
        status: 0,
        playerFirst: buildPlaceholderPlayer((idx + 1) * 2 - 1),
        playerSecond: buildPlaceholderPlayer((idx + 1) * 2),
      }));
      padded.push({ number: padded.length + 1, duels });
    }
    return padded;
  }

  if (tournament.players?.length) {
    return buildPlaceholderStages(tournament.players.slice(0, 16));
  }

  return buildPlaceholderStages(Array.from({ length: 16 }).map((_, idx) => buildPlaceholderPlayer(idx + 1)));
};

const TournamentBracket = ({ tournament }: TournamentBracketProps) => {
  const { t } = useTranslation();
  const stages = useMemo(() => normalizeStages(tournament), [tournament]);
  const totalRounds = stages.length;

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconifyIcon icon="mdi:bracket" fontSize={28} color="primary.main" />
        <Typography variant="h5" fontWeight={800} color="text.primary">
          {t('tournaments.bracket.title')}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${totalRounds}, minmax(260px, 1fr))`,
          columnGap: 5,
          overflowX: 'auto',
          pb: 1,
        }}
      >
        {stages.map((stage, roundIndex) => {
          const spacing = Math.max(3, 3 * Math.pow(2, roundIndex));

          return (
            <Stack key={stage.number} direction="column" spacing={2} sx={{ position: 'relative' }}>
              <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                {t(BRACKET_STAGE_TITLES[stage.number] ?? 'tournaments.bracket.roundLabel', { number: stage.number })}
              </Typography>

              <Stack direction="column" spacing={spacing} alignItems="flex-start">
                {stage.duels.map((duel) => (
                  <Fragment key={duel.number}>
                    <TournamentMatchCard duel={duel} roundIndex={roundIndex} totalRounds={totalRounds} t={t} />
                  </Fragment>
                ))}
              </Stack>
            </Stack>
          );
        })}
      </Box>
    </Stack>
  );
};

export default TournamentBracket;
